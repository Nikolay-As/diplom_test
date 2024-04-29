const led_pin = 575; // gpio 4
const button_pin = 588; // gpio 17
const gpio = require("onoff").gpio; // Подключаем библиотеку для работы с gpio
const led = new gpio(led_pin, "out");
const button = new gpio(button_pin, "in", "rising", { debounceTimeout: 10 });

button.watch((err, value) => {
  if (err) {
    console.log(err);
    throw err;
  }

  console.log(led.readSync());
  led.writeSync(led.readSync() ^ 1);
});

process.on("SIGINT", _ => {
  led.unexport();
  button.unexport();
});


// ПРИМЕР МИГАНИЯ СВЕТОДИОДА
//
// var pin = 575;
// var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
// var LED = new Gpio(pin, 'out'); //use GPIO pin 4, and specify that it is output
// var blinkInterval = setInterval(blinkLED, 500); //run the blinkLED function every 250ms

// function blinkLED() { //function to start blinking
//   if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
//     LED.writeSync(1); //set pin state to 1 (turn LED on)
//   } else {
//     LED.writeSync(0); //set pin state to 0 (turn LED off)
//   }
// }

// function endBlink() { //function to stop blinking
//   clearInterval(blinkInterval); // Stop blink intervals
//   LED.writeSync(0); // Turn LED off
//   LED.unexport(); // Unexport GPIO to free resources
// }

// setTimeout(endBlink, 60000); //stop blinking after 5 seconds
