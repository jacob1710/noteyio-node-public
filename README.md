# noteyio-node

## About NoteyIO

NoteyIO is a platform for taking notes, built using Express.js and MongoDB. NoteyIO was created to make adding notes to photos an quick and easy process.  

## How to Run

The docker-compose file, when built, runs the server and database in separate containers. To build the server, make sure Docker is installed and running, and run using: `docker-compose up -d --build`

To stop the server, use: `docker-compose stop`

The server will be available on port 3000 on localhost: visit [http://localhost:3000/api/alive](http://localhost:3000/api/alive) to check whether it is running successfully

