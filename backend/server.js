const http = require('http');
const https = require('https');
const port = process.env.PORT || 3000;
const httpServer = require('./index');
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;

// Clustering taken from:
// https://blog.appsignal.com/2021/02/03/improving-node-application-performance-with-clustering.html

// Start Server
// const server = app.listen(port, () => {
//   console.log(`Example app listening on port ${port}!`);
// },
// );

if (cluster.isMaster) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);
    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });
} else {
    console.log(`Worker ${process.pid} started`);
    const server = httpServer.listen(port, () => {
        console.log(`Noteyio listening on port ${port}!`);
    });
    module.exports = server;
}