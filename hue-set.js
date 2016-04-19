var HueApi = require("node-hue-api").HueApi;

module.exports = function(RED) {
  function HueSet(n) {
    RED.nodes.createNode(this,n);
    var node = this;
    node.bridge = RED.nodes.getNode(n.bridge);
    node.light = n.light;
    node.hue = node.bridge.hue;

    if(!node.hue) return;

    node.on("input",function(msg) {

      try {
        msg.payload = JSON.parse(msg.payload);
      } catch(e) {

      }

      if(node.light.indexOf("g-") === 0) {
        node.hue.setGroupLightState(node.light.substring(2), msg.payload)
          .then(function(result) {
            msg.payload = result;
            node.send(msg);
          }).fail(function(err) {
            node.error(err);
          }).done();
      } else {
        node.hue.setLightState(node.light, msg.payload)
          .then(function(result) {
            msg.payload = result;
            node.send(msg);
          }).fail(function(err) {
            node.error(err);
          }).done();
      }
    });
  }
  RED.nodes.registerType("hue-set",HueSet);
};
