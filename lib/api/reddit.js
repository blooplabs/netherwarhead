"use strict";

var request = require('request');

var reddit = {
  all: function (callback) {
    request
      .get({url: "http://www.reddit.com/r/all/top.json", json: true}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);

          if (callback) {
            callback(body);
          }
        }
      });
  }
};

module.exports = reddit;
