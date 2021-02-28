const express = require('express')
const app = express();
const {google} = require('googleapis')
const youtube = google.youtube('v3')
const {authenticate} = require('@google-cloud/local-auth')
const cors = require('cors');
var request = require('request');
var fs = require('fs');

var path = require('path')

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 40101;

app.use(cors());

let secrets = [];
let code = "";
let tokenJSON;
let tokenArray = [];
let videoJSON = [];
let videoIDs = [];

function readAuth() {
	fs.readFile('client_secret.json', function processClientSecrets(err, content) {
		if (err) {
			console.log('Error loading client secret file: ' + err);
			return;
		}
		// Authorize a client with the loaded credentials, then call the YouTube API.
		secrets = JSON.parse(content);
	});
}

app.listen(port, function() {
	console.log('Server listening on port ' + port);
});

app.get('/', function(req, res){
	readAuth();
	//res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=http%3A%2F%2Flocalhost:40101%2Fauth&response_type=code&client_id=226859199881-8aa8ifuqcmsc2do676i6k57gutmue9c8.apps.googleusercontent.com`)
})


app.get('/auth', function(req, res) {
	//console.log(req.query.code);
	code = req.query.code;
	request.post(`https://oauth2.googleapis.com/token`, {form:{
			code: code,
			client_id: "226859199881-8aa8ifuqcmsc2do676i6k57gutmue9c8.apps.googleusercontent.com",
			client_secret: "MKFyKLbl5au6SoCY9KWK2ZNE",
			redirect_uri: `http://localhost:40101/auth`,
			grant_type: "authorization_code"
		}}, function(err, httpResponse, body){
			tokenJSON = JSON.parse(body)

			tokenJSON.ip = req.ip;
			tokenArray.push(tokenJSON);
	});
	res.redirect('http://localhost:3000')
});

app.get('/token', function(req, res){
	tokenArray.forEach(token => console.log(token.ip))
	if(tokenArray.find(token => token.ip === req.ip)){
		res.json(tokenArray.find(token => token.ip === req.ip))
	} else {
		//console.log(req.ip)
		res.json({"accessToken": ""})
	}

})

app.get('/home', function(req, res){
	res.sendFile(path.join(__dirname + '/example.html'));
})

app.get('/search/:query', function(req, res, next) {
	let access = tokenArray.find(token => token.ip === req.ip)
	request(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&order=date&q=${req.params.query}&videoDuration=short&access_token=${access.access_token}`,
		function (err, httpResponse, body2) {
			if (body2) {
				videoJSON = JSON.parse(body2);
				videoIDs = [];
				if(!videoJSON.error){
					videoJSON.items.forEach(function (video) {
						videoIDs.push(video.id.videoId);
					})
					res.send(videoIDs);
				}
				next(err);
			}
		});
});
