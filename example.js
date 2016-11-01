"use strict";

const UnlimitedHand = require("./index");
UnlimitedHand
.list()
.then((ports) => {
  return new Promise((res, rej) => {
    if (ports.length > 0) {
      res(ports[0]);
    } else {
      rej();
    }
  });
})
.then(main)
.catch((err) => {
  console.error(err);
});

function main(port) {
  const hand = new UnlimitedHand(port.comName);
  hand.on("open", () => {
    console.log("device open!");
    hand.increaseVoltage();
    hand.increaseVoltage();
    hand.increaseVoltage();
    hand.increaseEMSTime();
    hand.increaseEMSTime();
    hand.increaseEMSTime();
    hand.vibrate1sec();
    setInterval(() => {
      hand.stimulate(Math.floor(Math.random() * 7));
      hand.vibrate300ms();
    }, 1000);
  });


  process.on("SIGINT", () => {
    hand.close();
  });
}
