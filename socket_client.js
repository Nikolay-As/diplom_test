// const io = require("socket.io-client");

// Если локалхост то не используем url_socket_server
// иначе const socket = io(url_socket_server);
const port = 3001;
const url_socket_server = "http://192.168.1.103:" + port;

const gpio = require("onoff").Gpio; // Подключаем библиотеку для работы с gpio
const dbFilePath = "./box.db";
var sqlite = require("better-sqlite3");
var db = new sqlite(dbFilePath);
let door_info_pin = new Array(); // тут хранится информация по пинам

socket.on("connect", () => {
  socket.emit("authorization", { id: 1 });
  console.log("передал успешно id");
});

socket.on("hello_world", () => {
  open_door(0);
});

door_info_pin = git_info_at_start();
if (door_info_pin.length != 0) {
  console.log("Приложение  готово к работе!");
  var socket = io(url_socket_server, { reconnect: true });
  //rents_start(0);
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
        castle_pin: row.castle_pin,
        led_bike_busy_pin: row.led_bike_busy_pin,
        button_bike_pin: row.button_bike_pin,
        led_bike_free_pin: row.led_bike_free_pin,
      };
      door_info_pin.push(structure);
    }
  }
  return door_info_pin;
}

// Функции управления с IoT элементами
function rents_start_timeout(gpio_button_element, number_door) {
  gpio_button_element.unexport();
  led_bike_busy_off(number_door);
  console.log(
    "Превышено время ожидания велосипеда в боксе №" + (number_door + 1) + "! "
  );
}

//process.on('SIGINT', ); //function to run when user closes using

function rents_start(number_door) {
  console.log("Поставьте велосипед в бокс!");
  let button_bike_pin = door_info_pin[number_door].button_bike_pin;

  let button = new gpio(button_bike_pin, "in", "both");

  let timerId = setTimeout(rents_start_timeout, 10000, button, number_door);
  led_bike_free_on(number_door);
  led_bike_busy_on(number_door);
  button.watch((err, value) => {
    if (err) {
      throw err;
    }
    if (value == 1) {
      clearTimeout(timerId);
      button.unexport();
      led_bike_free_off(number_door);
      console.log(
        "Велосипед успешно припаркован в бокс №" + (number_door + 1) + "! "
      );
    }
  });
}

function open_door(number_door) {
  let castle_pin = door_info_pin[number_door].castle_pin;
  console.log("Открыл");
  let castle = new gpio(castle_pin, "out");
  castle.writeSync(1);
}

function close_door(number_door) {
  let castle_pin = door_info_pin[number_door].castle_pin;
  console.log("Закрыл");
  let castle = new gpio(castle_pin, "out");
  castle.writeSync(0);
}

function led_bike_free_on(number_door) {
  let led_bike_free_pin = door_info_pin[number_door].led_bike_free_pin;
  let led = new gpio(led_bike_free_pin, "out");
  led.writeSync(1);
}
function led_bike_free_off(number_door) {
  let led_bike_free_pin = door_info_pin[number_door].led_bike_free_pin;
  let led = new gpio(led_bike_free_pin, "out");
  led.writeSync(0);
}

function led_bike_busy_on(number_door) {
  let led_bike_busy_pin = door_info_pin[number_door].led_bike_busy_pin;
  let led = new gpio(led_bike_busy_pin, "out");
  led.writeSync(1);
  //led.writeSync(led.readSync() ^ 1);
}
function led_bike_busy_off(number_door) {
  let led_bike_busy_pin = door_info_pin[number_door].led_bike_busy_pin;
  let led = new gpio(led_bike_busy_pin, "out");
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
}
