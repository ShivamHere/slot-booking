const http = require("http");
const path = require("path");

global.appRoot = path.resolve(__dirname);

const app = require("./app");
const port = 3001;
const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  switch (error.code) {
    case "EACCES":
      process.exit(1);
    case "EADDRINUSE":
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  console.error('Listening on ' + addr.port)
}