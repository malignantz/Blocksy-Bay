'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchHash = exports.searchLink = exports.writeLink = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _bcoin = require('bcoin');

var _paste = require('./paste');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('request');

// CONSTANTS
var id = 'primary';
var passphrase = 'primary';
var rate = '0.0001';
var token = '4022d3f1300495e42db532d279e50ac033a0fdd0a6c2d3f87b1904ddee16b854';
var bcoinPort = 18556;
var baseRequest = request.defaults({
  baseUrl: 'http://localhost:'.concat(bcoinPort)
});

var makeScript = function makeScript(data) {
  var opcodes = _bcoin.script.opcodes;
  var script = new _bcoin.script();
  script.push(opcodes.OP_RETURN);
  script.push(data);
  script.compile();

  return script.toJSON();
};

// Routing Links 

var fetchLink = function fetchLink(data) {

  var propsMap = {
    addData: {
      type: 'POST',
      url: '/wallet/' + id + '/send',
      data: {
        rate: rate,
        token: token,
        passphrase: passphrase,
        outputs: [{
          value: 0,
          script: data.content ? makeScript(data.content) : ''
        }]
      }
    },
    getData: {
      type: 'GET',
      url: '/tx/' + data.hash
    },
    getTrans: {
      type: 'GET',
      url: '/wallet/' + id + '/tx/history?token=' + token
    }
  };

  var props = propsMap[data.type];

  return new _promise2.default(function (resolve, reject) {
    var options = {
      method: props.type,
      uri: props.url,
      body: (0, _stringify2.default)(props.data)
    };
    // This is needed as creating a message doesn't allow JSON header to be set
    if (props.type === 'POST') delete options.json;

    baseRequest(options, function (err, resp, body) {
      if (err) reject(err);
      resolve(body);
    });
  });
};

// Converts the hex string back to ASCII (Human Readable) text
var decompile = function decompile(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }return str;
};

// Writes magnet links to paste.sh
// paste.sh link stored into blockchain
// Format
/* magnet:...&dn={name}\n
 * magnet:...&dn={name}\n
 * magnet:...&dn={name}\n
 */
var writeLink = function writeLink(data) {
  return (0, _paste.writeData)(data).then(function (url) {
    console.log('Url: ' + url);
    return fetchLink({
      type: 'addData',
      content: url
    });
  })
  // Creating new data to blockchain
  .then(function (data) {
    var dataObj = JSON.parse(data);
    console.log('Here\'s your data: ' + dataObj.hash);
    return dataObj.hash;
  });
};

// Search a transaction hash and extract the paste.sh URL
var searchHash = function searchHash(hash, name) {
  return fetchLink({ type: 'getData', hash: hash }).then(function (data) {
    if (!data.outputs) return;
    try {
      // Remove the first 4 bytes as that is the OP_RETURN
      var scriptContent = decompile(data.outputs[0].script.substring(4));
      if (scriptContent.includes('paste.sh')) {
        console.log('Url: ' + scriptContent);
        return (0, _paste.fetchData)(scriptContent);
      }
    } catch (err) {
      console.log(err);
    }
  });
};

// Search a wallet transaction history and sends it to searchHash to get the magnet links.
var searchLink = function searchLink(name) {
  return fetchLink({ type: 'getTrans' }).then(function (data) {
    // Loops through all data
    console.log('Line131', data);
    data = JSON.parse(data);
    _promise2.default.all(data.map(function (b) {
      return searchHash(b.hash, name);
    })).then(function (promArray) {
      console.log('Line150', promArray);
      return promArray.filter(function (b) {
        return b;
      });
    })
    // Ensure invalid transactions does not exit
    // Flatten the array. [[1,2],[3,4]] => [1,2,3,4]
    .then(function (data) {
      return [].concat.apply([], data);
    })
    // Filter the array based on name parameter
    .then(function (data) {
      while (name.includes(' ')) {
        name = name.replace(' ', '+').toLowerCase();
      }
      data.filter(function (currName) {
        return !currName || currName.toLowerCase().includes(name);
      });
    }).then(function (magnetLinks) {
      console.log(magnetLinks);
      return magnetLinks;
    });
  });
};

exports.writeLink = writeLink;
exports.searchLink = searchLink;
exports.searchHash = searchHash;