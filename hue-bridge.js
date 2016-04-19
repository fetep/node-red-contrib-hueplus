var HueApi = require("node-hue-api").HueApi;

module.exports = function(RED) {
  function HueBridge(n) {
    RED.nodes.createNode(this,n);
    var node = this;

    node.bridge = n.bridge;
    node.key = n.key;

    if(!node.bridge || !node.key) return;

    node.hue = new HueApi(node.bridge, node.key);
  }
  RED.nodes.registerType("hue-bridge",HueBridge);

  RED.httpAdmin.get('/philipshue/server', function(req, res, next){
		require("node-hue-api").nupnpSearch().then(function(result) {
			res.end(JSON.stringify(result));
    }).fail(function(err) {
      res.send(500).send(err.message);
		}).done();
	});

  RED.httpAdmin.get('/philipshue/register', function(req, res, next) {
    var hue = new HueApi();
    hue.registerUser(req.query.host)
      .then(function(result) {
        res.end(JSON.stringify(result));
      }).fail(function(err) {
        res.status(500).send(err.message);
      }).done();
  });

  RED.httpAdmin.get('/philipshue/lights', function(req, res, next) {
    if(!req.query.host || !req.query.key) {
      res.status(500).send("Missing arguments");
    } else {
      var hue = new HueApi(req.query.host, req.query.key);
      hue.lights().then(function(lights) {
        res.end(JSON.stringify(lights));
      }).fail(function(err) {
        res.status(500).send(err.message);
      }).done();
    }
  });

  RED.httpAdmin.get('/philipshue/groups', function(req, res, next) {
    if(!req.query.host || !req.query.key) {
      res.status(500).send("Missing arguments");
    } else {
      var hue = new HueApi(req.query.host, req.query.key);
      hue.groups().then(function(groups) {
        res.end(JSON.stringify(groups));
      }).fail(function(err) {
        res.status(500).send(err.message);
      }).done();
    }
  });
};
