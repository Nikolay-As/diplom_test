const  io  = require("socket.io-client");

// Если локалхост то не используем url_socket_server
// иначе const socket = io(url_socket_server);
const port = 3001;
const url_socket_server = 'http://192.168.0.16:'+port;
var socket = io(url_socket_server,{reconnect:true});

socket.on("connect", () => {
  console.log(socket.id); 
});

// socket.on("connect_error", (error) => {
//   if (socket.active) {
//     // temporary failure, the socket will automatically try to reconnect
//   } else {
//     // the connection was denied by the server
//     // in that case, `socket.connect()` must be manually called in order to reconnect
//     console.log(error.message);
//   }
// });
 