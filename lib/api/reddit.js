/*jshint node:true */
"use strict";

var request = require('request');

var reddit = {
  top: function (subreddit, callback) {
    var url = "http://www.reddit.com/r/" + subreddit + "/top.json";
    var currentTime = new Date();

    request
      .get({url: url + "?bust=" + currentTime, json: true}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          body.url = url;
          body.date = {
            "timestamp": currentTime.getTime(),
            "year": currentTime.getUTCFullYear(),
            "month": currentTime.getUTCMonth() + 1,  // Date.getUTCMonth is 0 indexed... wtf?
            "day": currentTime.getUTCDate(),
            "hour": currentTime.getUTCHours(),
            "minute": currentTime.getUTCMinutes()
          };

          if (callback) {
            callback(body);
          }
        }
      });
  }
};

module.exports = reddit;
