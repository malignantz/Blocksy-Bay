'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _baycoin = require('./baycoin');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Fetches a list of magnet links from terminal
/*
 * This file is a terminal variant to our frontend
 * 
 */

function getMagnets() {
  var magnets = [];
  console.log("Pump me Magnet Links (type 'q' to end):");
  return new _promise2.default(function (resolve, reject) {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (text) {
      var content = text.trim();
      if (content === 'q') resolve(magnets);else magnets.push(content);
    });
  });
}

// Function Calls
// writeLink('Cool Link', 'magnet:blablabla');
// SAMPLE Data to use writeLink
// const magnetLinks = [
//   'magnet:eafeafjaefjeaf&dn=New+Last+Try',
//   'magnet:eafeafjaefjeaf&dn=New+I+Need+To+Go',
//   'magnet:eafeafjaefjeaf&dn=New+Well+Well+Well',
// ]
// searchLink('{text}');
// searchHash('36f2733343fdb2a1b55048f85551fd2acf5bc7caab674b1968b4aabdaf39803f');
switch (process.argv[2]) {
  case 'write':
    getMagnets().then(function (magnets) {
      return (0, _baycoin.writeLink)(magnets.join("\n"));
    }).then(function () {
      return process.exit();
    });
    break;
  case 'search':
    (0, _baycoin.searchLink)(process.argv[3] ? process.argv[3] : '');
    break;
  case 'hash':
    console.log((0, _baycoin.searchHash)(process.argv[3]));
    break;
  default:
    console.log("I don't know what you are trying to do...");
};