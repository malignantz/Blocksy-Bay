import $ from 'jquery';
import submitAction from './submitAction';

import { makeScript }from '../utils/makeScript';

// BAD. Replace with endpoints
// import { writeLink, searchLink } from '../baycoin/baycoin';
/* globals
  window
*/
function addToBatch(){
    let name = $('#torrentname').val();
    while(name.includes("'")) {
      name = name.replace("'",'');
    }
 
    window.batchData.names.push(name);
    // console.log(batchData.names.length,batchData.datas.length);
    $('#torrentname').val('');
    // $('#data').val('');
  }

// export for others scripts to use
window.$ = $;
window.jQuery = $;
window.batchData = { names: [], datas: []};
window.addToBatch = addToBatch;
window.submitAction = submitAction;

$(() => {
  const indexTemplate = require('./template.html');
  console.log("HELLO");

  // REPLACE THIS
  // WITH THIS! :)
  // $.get('/search?text={tag}', function(data) {
  //  ... 
  // });
  // Client calls sErver
  // searchLink('').then(magnetObjs => {
  //   $('#loading').remove();
  //   magnetObjs = magnetObjs.slice(0,7);
  //   magnetObjs.forEach(magnetObj => {
  //     console.log('MagnetObj',magnetObj);
  //     let { name, link } = magnetObj;
  //     link = link.trim();
  //     name = 'tempName_chng_plz';
  //     while(link.includes('"')){
  //       link = link.replace('"','');
  //     }
  //     while(name.includes('"')){
  //       name = name.replace('"','');
  //     }
  //     $('#table').append($(`<tr><td>${name}</td><td><a href="${link}">Download</a></td></tr>`))
  //   });
  // });
  $('#app').html(indexTemplate);
  //const formActionButton = $('form button');
  

  $.get('/node/fee', (data) => {
    const value = data.rate;
    $('input[name="fee"]').val(value);
  });

  //formActionButton.on('click', submitAction);
});