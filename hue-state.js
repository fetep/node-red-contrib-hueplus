var HueApi = require("node-hue-api").HueApi;

module.exports = function(RED) {
  function HueState(n) {
    RED.nodes.createNode(this,n);
    var node = this;
    node.bridge = RED.nodes.getNode(n.bridge);
    node.light = n.light;
    node.hue = node.bridge.hue;

    if(!node.hue) return;

    node.on("input",function(msg) {
      if (node.light.indexOf("g-") === 0){
        node.hue.getGroup(node.light.substring(2)).then(function(group) {
          msg.payload = group;
          node.send(msg);
        }).fail(function(err) {
          node.error(err);
        }).done();
      } else {
          node.hue.lightStatus(node.light)
            .then(function(status){
              msg.payload = status;
              node.send(msg);
            }).fail(function(err) {
              node.error(err);
            }).done();
        }
    });
  }
  RED.nodes.registerType("hue-state",HueState);
};
