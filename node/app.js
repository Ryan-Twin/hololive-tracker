const express = require('express')
const app = express();

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 40101;

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(port, function() {
	console.log('Server listening on port ' + port);
});
