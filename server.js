const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPostRouter = require('./blog-posts');

app.use(morgan('common')); //log http layer

app.use(express.static('public'));

app.use('/blog-posts', blogPostRouter);

// both runServer and closeServer need to access the same
// server object, so we declare `server` here, and then when
// runServer runs, it assigns a value.
let server;

function runServer() {
	const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) => {  
		server = app.listen(port, () => {  
			console.log(`Your app is listening on port ${port}`);
			resolve(server);  
		}).on('error', err => {
			reject(err) 
		});		
	});
}

function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('Closing server');
		server.close(err => {					//server.close() method stops the HTTP server from accepting new connections
			if (err) { 
				reject(err);
				return;
			}
			resolve();
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};