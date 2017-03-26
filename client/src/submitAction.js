import $ from 'jquery';
import { reqProps, checkInputs } from '../utils/utils';

export default function submitClick() {
  const messageContainer = $('.server-messages');
  const apiKey = $('input[name="apiKey"]');
  const nodeEndpoint = '/node';

  const type = 'POST';
  const url = '/submitBatch';
  const dataLength = window.batchData.names.length;
  const data = JSON.stringify({magnets: window.batchData.names });

  $.ajax({
    type,
    url,
    data,
    processData: false,
    beforeSend: (xhr) => {
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa('' + ':' + apiKey.val()));
    },
    contentType: 'application/json',
  }).done((response) => {
    debugger;
    const prettyResponse = JSON.stringify(response, null, '\t');
    const pasteUrl = prettyResponse.trim();
    alert("Magnet Links have been saved");
  });
}
