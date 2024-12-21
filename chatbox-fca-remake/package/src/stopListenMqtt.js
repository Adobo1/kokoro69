"use strict";

/*
@NethWs3Dev
*/

// @NethWs3Dev

var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx){
  return function stopListenMqtt() {
    if (!ctx.mqttClient) {
      throw new Error("Not connected to MQTT");
    }
    log.warn("stopListenMqtt", "Stopping...");
    ctx.mqttClient.unsubscribe("/webrtc");
    ctx.mqttClient.unsubscribe("/rtc_multi");
    ctx.mqttClient.unsubscribe("/onevc");
    ctx.mqttClient.publish("/browser_close", "{}");
    ctx.mqttClient.end(false, (...data) => {
      log.info("stopListenMqtt", "Stopped");
      ctx.mqttClient = null;
    });
  }
};