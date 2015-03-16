/*jshint node:true */
"use strict";

var request = require('request');

var reddit = {
  getTop: function (subreddit, currentTime, callback) {
    var url = "http://www.reddit.com/r/" + subreddit + "/top.json";

    request
      .get({url: url + "?bust=" + currentTime, json: true}, function (error, response, body) {
        if (error) {
          callback(error);
        } else {
          if (response.statusCode === 200) {
            body.url = url;
            body.subreddit = subreddit;
            body.date = {
              "timestamp": currentTime.getTime(),
              "year": currentTime.getUTCFullYear(),
              "month": currentTime.getUTCMonth() + 1,  // Date.getUTCMonth is 0 indexed... wtf?
              "day": currentTime.getUTCDate(),
              "hour": currentTime.getUTCHours(),
              "minute": currentTime.getUTCMinutes()
            };
            callback(null, body);
          } else {
            var errorMessage = "Unexpected response code - " + url + ":" + response.statusCode;
            callback(new Error(errorMessage), body);
          }
        }
      });
  }
};

module.exports = reddit;
