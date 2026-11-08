(function (global) {
  'use strict';

  var DB_NAME = 'invitation-builder-assets';
  var DB_VERSION = 1;
  var META_STORE = 'meta';
  var BLOB_STORE = 'blobs';
  var PATH_PREFIX = 'images/';

  var MAX_FILE_BYTES = 20 * 1024 * 1024;
  var MAX_TOTAL_BYTES = 80 * 1024 * 1024;
  var MAX_ASSETS = 60;
  var MAX_PIXELS = 40000000;
  var MAX_NAME_LENGTH = 48;
  var THUMB_SIZE = 160;
  var DECODE_TIMEOUT = 15000;
  var OPEN_TIMEOUT = 5000;

  var MIME_BY_EXT = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
    gif: 'image/gif',
    svg: 'image/svg+xml'
  };

  var EXT_BY_MIME = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/gif': 'gif',
    'image/svg+xml': 'svg'
  };

  var SUPPORTED_LABEL = 'JPG, PNG, WebP, AVIF, GIF, or SVG';
  var ACCEPT = '.jpg,.jpeg,.png,.webp,.avif,.gif,.svg,image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml';

  var records = [];
  var byId = {};
  var byPath = {};
  var duplicateKeys = {};
  var urlByPath = {};
  var memoryBlobs = {};
  var loaded = false;
  var loading = null;
  var storageMode = 'indexeddb';

  function normalizePath(value) {
    var raw = String(value == null ? '' : value).trim().replace(/\\/g, '/');
    while (raw.indexOf('./') === 0) raw = raw.slice(2);
    return raw.toLowerCase();
  }

  function isLocalPath(value) {
    return normalizePath(value).indexOf(PATH_PREFIX) === 0;
  }

  function uniqueId() {
    return 'img-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  }

  function extensionFor(file) {
    var name = String(file.name || '');
    var dot = name.lastIndexOf('.');
    var ext = dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
    if (MIME_BY_EXT[ext]) return ext === 'jpeg' ? 'jpg' : ext;
    return EXT_BY_MIME[String(file.type || '').toLowerCase()] || '';
  }

  function slugFor(name) {
    var raw = String(name || '');
    var dot = raw.lastIndexOf('.');
    if (dot > 0) raw = raw.slice(0, dot);
    var slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    slug = slug.slice(0, MAX_NAME_LENGTH).replace(/-+$/g, '');
    return slug || 'photo';
  }

  function displayNameFor(name) {
    var raw = String(name || '').replace(/[\\/]+/g, ' ').trim();
    if (!raw) return 'image';
    return raw.length > 80 ? raw.slice(0, 77) + '\u2026' : raw;
  }

  function formatBytes(bytes) {
    var value = Number(bytes) || 0;
    if (value < 1024) return value + ' B';
    if (value < 1024 * 1024) return (value / 1024).toFixed(value < 10240 ? 1 : 0) + ' KB';
    return (value / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function totalBytes() {
    return records.reduce(function (sum, record) { return sum + (record.size || 0); }, 0);
  }

  function objectUrl(blob) {
    try { return global.URL.createObjectURL(blob); } catch (e) { return ''; }
  }

  function releaseUrl(path) {
    var key = normalizePath(path);
    var url = urlByPath[key];
    if (!url) return;
    try { global.URL.revokeObjectURL(url); } catch (e) {}
    delete urlByPath[key];
  }

  function releaseAllUrls() {
    Object.keys(urlByPath).forEach(function (key) { releaseUrl(key); });
  }

  function failure(message) {
    return { ok: false, error: message };
  }

  function success(asset) {
    return { ok: true, asset: asset };
  }

  function openDatabase() {
    return new Promise(function (resolve, reject) {
      var settled = false;
      var timer = global.setTimeout(function () {
        if (settled) return;
        settled = true;
        reject(new Error('indexeddb-timeout'));
      }, OPEN_TIMEOUT);

      function finish(error, db) {
        if (settled) {
          if (db && db.close) { try { db.close(); } catch (e) {} }
          return;
        }
        settled = true;
        global.clearTimeout(timer);
        if (error) reject(error);
        else resolve(db);
      }

      var request;
      try {
        request = global.indexedDB.open(DB_NAME, DB_VERSION);
      } catch (e) {
        finish(e);
        return;
      }

      request.onupgradeneeded = function () {
        var db = request.result;
        if (!db.objectStoreNames.contains(META_STORE)) db.createObjectStore(META_STORE, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(BLOB_STORE)) db.createObjectStore(BLOB_STORE);
      };
      request.onsuccess = function () { finish(null, request.result); };
      request.onerror = function () { finish(request.error || new Error('indexeddb-failed')); };
      request.onblocked = function () { finish(new Error('indexeddb-blocked')); };
    });
  }

  var dbPromise = null;
  var dbFailed = false;

  function getDb() {
    if (!global.indexedDB) return Promise.reject(new Error('indexeddb-unsupported'));
    if (dbFailed) return Promise.reject(new Error('indexeddb-unavailable'));
    if (!dbPromise) {
      dbPromise = openDatabase().then(function (db) {
        db.onversionchange = function () {
          try { db.close(); } catch (e) {}
        };
        return db;
      }).catch(function (error) {
        dbFailed = true;
        storageMode = 'memory';
        throw error;
      });
    }
    return dbPromise;
  }

  function runTransaction(stores, mode, work) {
    return getDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var transaction;
        try {
          transaction = db.transaction(stores, mode);
        } catch (e) {
          reject(e);
          return;
        }
        var results = [];
        transaction.oncomplete = function () { resolve(results); };
        transaction.onerror = function () { reject(transaction.error || new Error('indexeddb-error')); };
        transaction.onabort = function () { reject(transaction.error || new Error('indexeddb-abort')); };
        try {
          work(transaction, results);
        } catch (e) {
          try { transaction.abort(); } catch (err) {}
          reject(e);
        }
      });
    });
  }

  function readMetaRecords() {
    if (!global.indexedDB) {
      storageMode = 'memory';
      return Promise.resolve([]);
    }
    return runTransaction(META_STORE, 'readonly', function (transaction, results) {
      var request = transaction.objectStore(META_STORE).getAll();
      request.onsuccess = function () { results.push(request.result || []); };
    }).then(function (results) {
      return results[0] || [];
    });
  }

  function readBlob(id) {
    if (memoryBlobs[id]) return Promise.resolve(memoryBlobs[id]);
    if (storageMode !== 'indexeddb') return Promise.resolve(null);
    return runTransaction(BLOB_STORE, 'readonly', function (transaction, results) {
      var request = transaction.objectStore(BLOB_STORE).get(id);
      request.onsuccess = function () { results.push(request.result || null); };
    }).then(function (results) {
      return results[0] || null;
    }).catch(function () {
      return null;
    });
  }

  function persist(record, blob) {
    if (storageMode !== 'indexeddb') {
      memoryBlobs[record.id] = blob;
      return Promise.resolve();
    }
    return runTransaction([META_STORE, BLOB_STORE], 'readwrite', function (transaction) {
      transaction.objectStore(META_STORE).put(record);
      transaction.objectStore(BLOB_STORE).put(blob, record.id);
    }).catch(function () {
      storageMode = 'memory';
      memoryBlobs[record.id] = blob;
    });
  }

  function load() {
    return readMetaRecords().then(function (list) {
      records = (Array.isArray(list) ? list : []).filter(function (record) {
        return record && record.id && record.path && record.size >= 0;
      }).sort(function (a, b) {
        return (a.createdAt || 0) - (b.createdAt || 0);
      });

      byId = {};
      byPath = {};
      duplicateKeys = {};
      records.forEach(function (record) {
        byId[record.id] = record;
        byPath[normalizePath(record.path)] = record;
        if (record.duplicateKey) duplicateKeys[record.duplicateKey] = record.id;
      });
      loaded = true;
      return records;
    }).catch(function () {
      if (storageMode !== 'memory') storageMode = 'memory';
      records = [];
      loaded = true;
      return records;
    });
  }

  function ready() {
    if (loaded) return Promise.resolve(records);
    if (!loading) loading = load();
    return loading;
  }

  function makeThumb(image) {
    var width = image.naturalWidth || image.width || 0;
    var height = image.naturalHeight || image.height || 0;
    if (!width || !height) return '';
    try {
      var scale = Math.min(1, THUMB_SIZE / Math.max(width, height));
      var canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      var context = canvas.getContext('2d');
      if (!context) return '';
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      var data = canvas.toDataURL('image/webp', 0.72);
      return data.indexOf('data:image/') === 0 ? data : '';
    } catch (e) {
      return '';
    }
  }

  function inspect(file) {
    return new Promise(function (resolve, reject) {
      var url = objectUrl(file);
      if (!url) {
        reject(new Error('This browser cannot read the selected file.'));
        return;
      }
      var image = new Image();
      var settled = false;
      var timer = global.setTimeout(function () {
        finish(new Error('The image took too long to load. Try a smaller file.'));
      }, DECODE_TIMEOUT);

      function finish(error, info) {
        if (settled) return;
        settled = true;
        global.clearTimeout(timer);
        try { global.URL.revokeObjectURL(url); } catch (e) {}
        if (error) reject(error);
        else resolve(info);
      }

      image.onload = function () {
        var width = image.naturalWidth || image.width || 0;
        var height = image.naturalHeight || image.height || 0;
        if (width && height && width * height > MAX_PIXELS) {
          finish(new Error('This image is too large to use (' + width + '\u00d7' + height + '). Resize it and try again.'));
          return;
        }
        finish(null, { width: width, height: height, thumb: makeThumb(image) });
      };
      image.onerror = function () {
        finish(new Error('That file could not be read as an image. Use ' + SUPPORTED_LABEL + '.'));
      };
      image.src = url;
    });
  }

  function reservePath(name, ext) {
    var base = slugFor(name);
    var candidate = PATH_PREFIX + base + '.' + ext;
    var counter = 2;
    while (byPath[normalizePath(candidate)]) {
      candidate = PATH_PREFIX + base + '-' + counter + '.' + ext;
      counter += 1;
    }
    return candidate;
  }

  function add(file) {
    return ready().then(function () {
      if (!file || typeof file.size !== 'number') return failure('Choose an image file to upload.');

      var ext = extensionFor(file);
      if (!ext) return failure('Unsupported file type. Use ' + SUPPORTED_LABEL + '.');

      if (file.size > MAX_FILE_BYTES) {
        return failure('This image is ' + formatBytes(file.size) + '. The limit is ' + formatBytes(MAX_FILE_BYTES) + ' per image.');
      }
      if (records.length >= MAX_ASSETS) {
        return failure('You have reached the limit of ' + MAX_ASSETS + ' uploaded images. Remove one or use an image link.');
      }

      var duplicateKey = [String(file.name || ''), file.size, file.lastModified || 0].join('|');
      if (duplicateKeys[duplicateKey] && byId[duplicateKeys[duplicateKey]]) {
        return success(byId[duplicateKeys[duplicateKey]]);
      }

      if (totalBytes() + file.size > MAX_TOTAL_BYTES) {
        return failure('Your uploads would pass the ' + formatBytes(MAX_TOTAL_BYTES) + ' total limit. Remove an image or use an image link.');
      }

      return inspect(file).then(function (info) {
        var record = {
          id: uniqueId(),
          path: reservePath(file.name, ext),
          name: displayNameFor(file.name),
          type: MIME_BY_EXT[ext] || file.type || '',
          size: file.size,
          lastModified: file.lastModified || 0,
          width: info.width,
          height: info.height,
          thumb: info.thumb,
          duplicateKey: duplicateKey,
          createdAt: Date.now()
        };

        records.push(record);
        byId[record.id] = record;
        byPath[normalizePath(record.path)] = record;
        duplicateKeys[duplicateKey] = record.id;

        var url = objectUrl(file);
        if (url) urlByPath[normalizePath(record.path)] = url;

        return persist(record, file).then(function () {
          return success(record);
        });
      }, function (error) {
        return failure(error && error.message ? error.message : 'That image could not be read.');
      });
    }).catch(function (error) {
      return failure(error && error.message ? error.message : 'The image could not be saved.');
    });
  }

  function findByPath(path) {
    return byPath[normalizePath(path)] || null;
  }

  function urlForPath(path) {
    return urlByPath[normalizePath(path)] || '';
  }

  function getBlobForPath(path) {
    var record = findByPath(path);
    if (!record) return Promise.resolve(null);
    return readBlob(record.id);
  }

  function warm(paths) {
    return ready().then(function () {
      var wanted = [];
      (paths || []).forEach(function (path) {
        if (!isLocalPath(path)) return;
        var key = normalizePath(path);
        if (wanted.indexOf(key) === -1 && !urlByPath[key] && byPath[key]) wanted.push(key);
      });
      return Promise.all(wanted.map(function (key) {
        var record = byPath[key];
        return readBlob(record.id).then(function (blob) {
          if (blob && !urlByPath[key]) {
            var url = objectUrl(blob);
            if (url) urlByPath[key] = url;
          }
        });
      })).catch(function () {});
    });
  }

  function removeFile(path) {
    var key = normalizePath(path);
    var record = byPath[key];
    if (!record) return Promise.resolve(false);

    delete byPath[key];
    delete byId[record.id];
    if (record.duplicateKey) delete duplicateKeys[record.duplicateKey];
    records = records.filter(function (item) { return item.id !== record.id; });
    delete memoryBlobs[record.id];
    releaseUrl(record.path);

    if (storageMode !== 'indexeddb') return Promise.resolve(true);
    return runTransaction([META_STORE, BLOB_STORE], 'readwrite', function (transaction) {
      transaction.objectStore(META_STORE).delete(record.id);
      transaction.objectStore(BLOB_STORE).delete(record.id);
    }).then(function () {
      return true;
    }).catch(function () {
      return true;
    });
  }

  function prune(paths) {
    var keep = {};
    (paths || []).forEach(function (path) {
      if (isLocalPath(path)) keep[normalizePath(path)] = true;
    });
    var stale = records.filter(function (record) {
      return !keep[normalizePath(record.path)];
    });
    if (!stale.length) return Promise.resolve(0);
    return Promise.all(stale.map(function (record) {
      return removeFile(record.path);
    })).then(function () {
      return stale.length;
    });
  }

  function clear() {
    records = [];
    byId = {};
    byPath = {};
    duplicateKeys = {};
    memoryBlobs = {};
    releaseAllUrls();
    if (storageMode !== 'indexeddb') return Promise.resolve();
    return runTransaction([META_STORE, BLOB_STORE], 'readwrite', function (transaction) {
      transaction.objectStore(META_STORE).clear();
      transaction.objectStore(BLOB_STORE).clear();
    }).catch(function () {});
  }

  global.ImageAssets = {
    accept: ACCEPT,
    supportedLabel: SUPPORTED_LABEL,
    limits: {
      fileBytes: MAX_FILE_BYTES,
      totalBytes: MAX_TOTAL_BYTES,
      count: MAX_ASSETS
    },
    ready: ready,
    isReady: function () { return loaded; },
    add: add,
    list: function () { return records.slice(); },
    findByPath: findByPath,
    getBlobForPath: getBlobForPath,
    isLocalPath: isLocalPath,
    urlForPath: urlForPath,
    warm: warm,
    prune: prune,
    clear: clear,
    formatBytes: formatBytes,
    isPersistent: function () { return storageMode === 'indexeddb'; }
  };
})(window);
