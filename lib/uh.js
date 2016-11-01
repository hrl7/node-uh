"use strict";

const SerialPort = require("serialport");
const fs = require("fs");
const debug = require("debug")("UnlimitedHand:Serial");

const VID = "0x0403";
const PID = "0x6001";

class UnlimitedHand {
  constructor(path) {
    this.port = new SerialPort(path, {
      baudRate: 115200 
    });
    this.isOpen = false;
    this.port.on("open", () => {
      this.isOpen = true;
    });
    this.port.on("close", () => {
      this.isOpen = false;
    });

    this.port.on("data", (data) => {
      debug(data.toJSON().data);
    });
  }

  // channel should be 0 ~ 7
  stimulate(channel) {
    if (channel >= 0 && channel < 8) {
      this.write([48 + channel]);
    } else {
      debug("illigal channel value :", channel);
    } 
  }

  increaseVoltage() {
    this.write([104]);
  }

  increaseEMSTime() {
    this.write([109]);
  }

  vibrate300ms() {
    this.write([98]);
  }

  vibrate1sec() {
    this.write([66]);
  }

  vibrateOn() {
    this.write([100]);
  }

  vibrateOff() {
    this.write([101]);
  }

  write(buf) {
    if (this.isOpen) {
      this.port.write(Buffer.from(buf));
      debug("write :", buf);
    }
  }

  close() {
    debug("close");
    this.port.close();
  }

  on(event, callback) {
    this.port.on(event, callback);
  }

  off(event) {
    this.port.removeListener(event);
  }

  removeAllListeners() {
    this.port.removeAllListeners();
  }

  static list() {
    return new Promise((res, rej) => {
      SerialPort.list(function (err, ports) {
        if (err){ 
          rej(err);
        }
        res(ports.filter((port) => {
          return port.vendorId === VID && port.productId === PID;
        }));
      });
    });
  }
}

module.exports = UnlimitedHand;
