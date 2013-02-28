if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to npm-test.";
  };

  Template.hello.events({

    'click button' : function () {
      event.preventDefault();
      
      Meteor.call($(event.currentTarget).attr('id'), $('#text').attr('value'), null, function(err, res){

        if(err){

          console.log('error: ' + JSON.stringify(err));
        }

        console.log('result: ' + JSON.stringify(res));

      });

      return false;
    },

  });
}

if (Meteor.isServer) {

  //var curl, parseString;

  Meteor.startup(function () {
      var require = __meteor_bootstrap__.require;
      var path = require('path');
      var base = path.resolve('.');
      var isBundle = path.existsSync(base + '/bundle');
      var modulePath = base + (isBundle ? '/bundle/static' : '/public') + '/node_modules';

      curl = require(modulePath + '/curlrequest');
      parseString = require(modulePath + '/xml2js').parseString;
      pivotal = require(modulePath + "/pivotal");

      Future = require('fibers/future');

      /*pivotal.getToken('sam@bigroomstudios.com', '********', function(err, token){

          if(err){

              console.error("Could not retrieve token");
          }

          console.log(token);
      });*/

      pivotal.useToken('****************');

  });

  Meteor.methods({

    pivotal: function(id){

      var fut = new Future();

      pivotal.getProject(id, function(err, res){

          if(err){

              console.error(err);
          }

          console.log(res);

          fut.ret(res);
      });

      return fut.wait();
    },

    curl: function(url) {

        var options = { url: url, include: true };

        var fut = new Future();

        curl.request(options, function (err, parts) {

            parts = parts.split('\r\n');
            var data = parts.pop()
              , head = parts.pop();

            fut.ret(data);
        });

        return fut.wait();
    },

    xml: function(xml){

      var fut = new Future();

      parseString(xml, function (err, result) {
          fut.ret(result);
      });

      return fut.wait();
    }

  });
}
