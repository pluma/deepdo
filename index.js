/*jshint browserify: true */
'use strict';
var wildcard = {wildcard: true};

function _tokenize(key) {
  var tokens = [];
  for (var i = 0; i < key.length; i++) {
    var token = '';
    if (key[i] === '*' && (i + 1 >= key.length || key[i + 1] === '.')) {
      tokens.push(wildcard);
      i++;
      continue;
    }
    for (; i < key.length && key[i] !== '.'; i++) {
      if (key[i] === '\\') i++;
      token += key[i];
    }
    tokens.push(token);
  }
  return tokens;
}

function _propkeys(keys, key) {
  var propkeys = [];
  for (var i = 0; i < keys.length; i++) {
    if (keys[i][0] !== key && keys[i][0] !== wildcard) continue;
    if (keys[i].length === 1) return true;
    propkeys.push(keys[i].slice(1));
  }
  return propkeys;
}

function _omit(keys, source, obj, noStubs) {
  var modified = false;
  for (var key in source) {
    if (!source.hasOwnProperty(key)) continue;
    var propkeys = _propkeys(keys, key);
    if (propkeys === wildcard) continue;
    var prop = source[key];
    if (source[key] && typeof source[key] === 'object') {
      prop = Array.isArray(source[key]) ? [] : {};
      var propmodified = _omit(propkeys, source[key], prop, noStubs);
      if (!propmodified && noStubs) continue;
    }
    obj[key] = prop;
    modified = true;
  }
  return modified;
}

function _pick(keys, source, obj, noStubs) {
  var modified = false;
  for (var key in source) {
    if (!source.hasOwnProperty(key)) continue;
    var propkeys = _propkeys(keys, key);
    if (propkeys.length === 0) continue;
    var prop = source[key];
    if (propkeys !== wildcard) {
      if (!source[key] || typeof source[key] !== 'object') continue;
      prop = Array.isArray(source[key]) ? [] : {};
      var propmodified = _pick(propkeys, source[key], prop, noStubs);
      if (!propmodified && noStubs) continue;
    }
    obj[key] = prop;
    modified = true;
  }
  return modified;
}

function _mutate(path, fn, source) {
  var obj = source;
  var val = obj;
  var key = null;
  while (path.length) {
    key = path.shift();
    if (val.hasOwnProperty(key)) {
      if (key === wildcard) {
        for (var k in val) {
          if (!val.hasOwnProperty(k)) continue;
          _mutate([k].concat(path), fn, val);
        }
      }
      return;
    }
    obj = val;
    val = obj[key];
  }
  obj[key] = fn(obj[key], key, obj);
}

function omitClean(keys, source) {
  var _keys = Array.isArray(keys) ? keys : [keys];
  var obj = Array.isArray(source) ? [] : {};
  _omit(_keys.map(_tokenize), source, obj, true);
  return obj;
}

function omit(keys, source) {
  var _keys = Array.isArray(keys) ? keys : [keys];
  var obj = Array.isArray(source) ? [] : {};
  _omit(_keys.map(_tokenize), source, obj, false);
  return obj;
}

function pickClean(keys, source) {
  var _keys = Array.isArray(keys) ? keys : [keys];
  var obj = Array.isArray(source) ? [] : {};
  _pick(_keys.map(_tokenize), source, obj, true);
  return obj;
}

function pick(keys, source) {
  var _keys = Array.isArray(keys) ? keys : [keys];
  var obj = Array.isArray(source) ? [] : {};
  _pick(_keys.map(_tokenize), source, obj, false);
  return obj;
}

function mutate(map, source) {
  if (Array.isArray(map)) {
    for (var i = 0; i < map.length; i++) {
      var item = map[i];
      _mutate(_tokenize(item[0]), item[1], source);
    }
  } else {
    for (var key in map) {
      if (!map.hasOwnProperty(key)) continue;
      _mutate(_tokenize(key), map[key], source);
    }
  }
  return source;
}

exports.omitClean = omitClean;
exports.omit = omit;
exports.pickClean = pickClean;
exports.pick = pick;
exports.mutate = mutate;