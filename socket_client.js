// const io = require("socket.io-client");

// Если локалхост то не используем url_socket_server
// иначе const socket = io(url_socket_server);
// const port = 3001;
// const url_socket_server = "http://192.168.0.16:" + port;
// var socket = io(url_socket_server, { reconnect: true });

const led_pin = 575; // gpio 4
const gpio = require("onoff").Gpio; // Подключаем библиотеку для работы с gpio
const led = new gpio(led_pin, "out");
const sqlite3 = require("sqlite3");
const dbFilePath = "./box.db";
let door_info_pin = new Array(); // тут хранится информация по пинам

// socket.on("connect", () => {
//   socket.emit("authorization",{id : 1})
//   console.log("передал успешно id");
// });

// socket.on("hello_world", () => {
//   console.log(led.readSync());
//   led.writeSync(led.readSync() ^ 1);
// });

function git_info_at_start() {
  let door_info_pin = new Array();
  let db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
  db.serialize(() => {
    db.each(`SELECT * FROM door_info`, (err, row) => {
      if (err) {
        console.error(err.message);
      } else {
        let  structure = {
          id: row.id,
          servo_pin: row.servo_pin,
          led_bike_pin: row.led_bike_pin,
          button_bike_pin: row.button_bike_pin,
          buzzer_pin: row.buzzer_pin,
          led_buzzer_pin: row.led_buzzer_pin,
          led_lighting_pin: row.led_lighting_pin
        };
        door_info_pin.push(structure);
        console.log(structure)
      }
    });

    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
    });
    console.log(door_info_pin)
    return door_info_pin;

  });

  // db.close((err) => {
  //   if (err) {
  //     console.error(err.message);
  //   }
  // });
  // console.log(door_info_pin)
  // return door_info_pin;
}


door_info_pin = git_info_at_start();
console.log(door_info_pin)
if (door_info_pin.length != 0) {
  console.log("Приложение  готово к работе!");
  console.log(door_info_pin[0]);
} else {
  console.log("Приложение не готово к работе, проверьте БД");
}

function open_door(number_door) {}

function close_door(number_door) {}
