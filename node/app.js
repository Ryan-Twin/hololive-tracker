const express = require('express')
const app = express();

var path = require('path')

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 40101;

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/example.html'));
});

app.get('activities', (req, res) => {
	res.send(req);
})

app.listen(port, function() {
	console.log('Server listening on port ' + port);
});
