"use strict";

var request = require('request');

var reddit = {
  top: function (subreddit, callback) {
    var url = "http://www.reddit.com/r/" + subreddit + "/top.json";
    var currentTime = (new Date()).getTime();

    request
      .get({url: url + "?bust=" + currentTime, json: true}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          body.url = url;
          body.timestamp = currentTime;

          if (callback) {
            callback(body);
          }
        }
      });
  }
};

module.exports = reddit;
