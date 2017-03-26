const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodeRouter = require('./nodeRouter.js');
const cookieParser = require('cookie-parser');
const addTorrentHandler = require('./requests/addTorrent');
const childProcess = require('child_process');
const request = require('request');
const baycoin = require('../baycoin-lib/baycoin')
 // { writeLink, searchLink, searchHash } from './baycoin';

const app = express();
app.set('port', (process.env.PORT || 5000));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/node', nodeRouter);
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});


app.get('/search', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  baycoin.searchLink(req.query.text ? req.query.text : '')
    .then(magnets => res.send(JSON.stringify({result: magnets})));
});

app.post('/submitBatch', (req,res) => {
	// UNTESTED!!! Try at your own risk! To Garrett!
  let magnets = req.body.magnets;
  baycoin.writeLink(magnets)
    .then(hash => res.send({result: "BOOYAH!"}));

  // let { names, datas } = req.body;
	// let batchString = names.reduce( (total, name,i) => {
	// 	return total + `name${i}=${name}&data${i}=${datas[i]}&`;
	// },'');
	// childProcess.exec(`echo '${batchString}' > file.txt && ${__dirname}/paste.sh -p file.txt`,
 //  		function (error, stdout, stderr) {
 //    		var urlIndex = stdout.indexOf('https:');
 //    		let pasteUrl = stdout.slice(urlIndex).trim();
 //    		if (error !== null) {
 //     			 console.log('exec error: ' + error);
 //   			 }
 //   			 childProcess.exec(`${__dirname}/paste.sh ${pasteUrl}`, function (error, stdout, stderr) {
 //   			 	stdout = stdout.trim();
 //   			 	//console.log(stderr);
 //   			 	//console.log('_',stdout,'_');
 //   			 	res.end(pasteUrl);
 //   			 });
	// 	});
});

app.get('/addTorrent', addTorrentHandler);

app.listen(app.get('port'), '127.0.0.1', () => {
  console.log('Node app is running on port!', app.get('port')); // eslint-disable-line no-console
});
