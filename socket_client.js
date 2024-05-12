// const io = require("socket.io-client");

// Если локалхост то не используем url_socket_server
// иначе const socket = io(url_socket_server);
// const port = 3001;
// const url_socket_server = "http://192.168.0.16:" + port;
// var socket = io(url_socket_server, { reconnect: true });

//const led_pin = 575; // gpio 4
const gpio = require("onoff").Gpio; // Подключаем библиотеку для работы с gpio
// pigpio.configureSocketPort(8889);
// var gpio_servo = pigpio.Gpio;
//const led = new gpio(led_pin, "out");
// const sqlite3 = require("sqlite3");
const dbFilePath = "./box.db";
var sqlite = require("better-sqlite3");
var db = new sqlite(dbFilePath);
let door_info_pin = new Array(); // тут хранится информация по пинам

// socket.on("connect", () => {
//   socket.emit("authorization",{id : 1})
//   console.log("передал успешно id");
// });

// socket.on("hello_world", () => {
//   console.log(led.readSync());
//   led.writeSync(led.readSync() ^ 1);
// });

door_info_pin = git_info_at_start();
if (door_info_pin.length != 0) {
  console.log("Приложение  готово к работе!");
  start_watch_button(0);
  // open_door(0);
  // setTimeout(close_door, 4000, 0);
  // setTimeout(open_door, 8000, 0);
  // setTimeout(close_door, 12000, 0);
  // setTimeout(open_door, 16000, 0);
  // setTimeout(close_door, 20000, 0);
  //led_lighting_door_off(0);
} else {
  console.log("Приложение не готово к работе, проверьте БД");
}

// Системные функции
function git_info_at_start() {
  let door_info_pin = new Array();
  queries_text = `SELECT * FROM door_info`;
  result = runQueries(queries_text);
  if (result.length != 0) {
    for (let row of result) {
      let structure = {
        id: row.id,
        servo_pin: row.servo_pin,
        led_bike_pin: row.led_bike_pin,
        button_bike_pin: row.button_bike_pin,
        buzzer_pin: row.buzzer_pin,
        led_buzzer_pin: row.led_buzzer_pin,
        led_lighting_pin: row.led_lighting_pin,
      };
      door_info_pin.push(structure);
    }
  }
  return door_info_pin;
}

// Функции управления с IoT элементами
function rents_start_timeout(gpio_button_element) {
  gpio_element.unexport();
  return false;
}

function rents_start(number_door) {
  let button_bike_pin = door_info_pin[number_door].button_bike_pin;
  let button = new gpio(button_bike_pin, "in", "both");
  setTimeout(close_door, 20000, 0);
  let led_bike_pin = door_info_pin[number_door].led_bike_pin;
  let led = new gpio(led_bike_pin, "out");
  button.watch((err, value) => {
    if (err) {
      throw err;
    }
    console.log(value);
    console.log(led.readSync());
    if (led.readSync() != value) {
      led.writeSync(value);
      if (value == 1) {
        open_door(0);
        button.unexport();
        led.unexport();
        return true;
      } else {
        close_door(0);
      }
      // button.unexport()
    }
  });
}

function open_door(number_door) {
  let servo_pin = door_info_pin[number_door].servo_pin;
  console.log("Открыл");
  let servo = new gpio(servo_pin, "out");
  servo.writeSync(1);
}

function close_door(number_door) {
  let servo_pin = door_info_pin[number_door].servo_pin;
  console.log("Закрыл");
  let servo = new gpio(servo_pin, "out");
  servo.writeSync(0);
}

function led_bike_on(number_door) {
  let led_bike_pin = door_info_pin[number_door].led_bike_pin;
  console.log(led_bike_pin);
  let led = new gpio(led_bike_pin, "out");
  led.writeSync(1);
  //led.writeSync(led.readSync() ^ 1);
}
function led_bike_off(number_door) {
  let led_bike_pin = door_info_pin[number_door].led_bike_pin;
  console.log(led_bike_pin);
  let led = new gpio(led_bike_pin, "out");
  led.writeSync(0);
  //led.writeSync(led.readSync() ^ 1);
}

function led_lighting_door_on(number_door) {
  let led_pin = door_info_pin[number_door].led_lighting_pin;
  console.log(led_pin);
  let led = new gpio(led_pin, "out");
  led.writeSync(1);
  //led.writeSync(led.readSync() ^ 1);
}
function led_lighting_door_off(number_door) {
  let led_pin = door_info_pin[number_door].led_lighting_pin;
  console.log(led_pin);
  let led = new gpio(led_pin, "out");
  led.writeSync(0);
}

// Функции связанные с SQL
function runQueries(queries_text, parametr = null) {
  let result = new Array();
  try {
    result = db.prepare(queries_text).all();
    return result;
  } catch (err) {
    console.log("Getting error " + err);
    return result;
  }
  //var rows = db.prepare(queries_text).all();
  // let db =  new sqlite3.Database(
  //   dbFilePath,
  //   sqlite3.OPEN_READWRITE,
  //   (err) => {
  //     if (err) {
  //       console.log("Getting error " + err);
  //       return result;
  //     } else {
  //       if (parametr) {
  //         db.all(queries_text, parametr, (err, rows) => {
  //           if (err) {
  //             console.log("Getting error " + err);
  //             return result;
  //           } else {
  //             console.log("nen1");
  //             result = rows;
  //             return result;
  //           }
  //         });
  //       } else {
  //         db.all(queries_text, (err, rows) => {
  //           if (err) {
  //             console.log("Getting error " + err);
  //             return result;
  //           } else {
  //             result = rows;
  //             return result;
  //           }
  //         });
  //       }
  //     }
  //   }
  // );
}
