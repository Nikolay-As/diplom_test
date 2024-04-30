const io = require("socket.io-client");

// Если локалхост то не используем url_socket_server
// иначе const socket = io(url_socket_server);
const port = 3001;
const url_socket_server = "http://192.168.0.16:" + port;
var socket = io(url_socket_server, { reconnect: true });

const led_pin = 575; // gpio 4
const gpio = require("onoff").Gpio; // Подключаем библиотеку для работы с gpio
const led = new gpio(led_pin, "out");

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("hello_world", () => {
  console.log("успех");
  led.writeSync(led.readSync() ^ 1);
});

