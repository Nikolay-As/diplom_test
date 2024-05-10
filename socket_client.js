// const io = require("socket.io-client");

// Если локалхост то не используем url_socket_server
// иначе const socket = io(url_socket_server);
// const port = 3001;
// const url_socket_server = "http://192.168.0.16:" + port;
// var socket = io(url_socket_server, { reconnect: true });

const led_pin = 575; // gpio 4
const gpio = require("onoff").Gpio; // Подключаем библиотеку для работы с gpio
const led = new gpio(led_pin, "out");
const sqlite3 = require('sqlite3')
const dbFilePath = '/box.db';

// socket.on("connect", () => {
//   socket.emit("authorization",{id : 1})
//   console.log("передал успешно id");
// });

// socket.on("hello_world", () => {
//   console.log(led.readSync());
//   led.writeSync(led.readSync() ^ 1);
// });

let db = new sqlite3.Database('./box.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

function open_door(number_door){

}

function close_door(number_door){
  
}

function connect_sql(){
  
}