import $ from 'jquery';
import submitAction from './submitAction';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function addToBatch(){
  let name = $('#magnets').val();
  while(name.includes("'")) {
    name = name.replace("'",'');
  }

  window.batchData.names.push(name);
  $('#magnets').val('');
}

function submitSearch() {
  var search = $('#search').val();
  $.get( "/search?text=" + search, function( data ) {
    rewriteTable(fetchCodes(data));
  });
}

function fetchCodes(data) {
  var codes = '';
  data.result.map(function(magnet) {
    codes += `<tr><td>${fetchName(magnet)}</td><td><a href="${magnet}">Download</a></td></tr>`
  });

  return codes;
}

function rewriteTable(codes) {
  $('#table tbody').html('');
  $('#table tbody').append($(codes));
}

function fetchName(magnet) {
  return magnet.substring(magnet.indexOf('&dn=') + 4).split('+').join(' ').split('-').join(' ');
}

// export for others scripts to use
window.$ = $;
window.jQuery = $;
window.batchData = { names: [], datas: []};
window.addToBatch = addToBatch;
window.submitAction = submitAction;
window.submitSearch = submitSearch;


$(() => {
  const indexTemplate = require('./template.html');
  $.get( "/search", function( data ) {
    rewriteTable(fetchCodes(data));
  });

  $('#app').html(indexTemplate);
});