/*jshint node:true */
"use strict";

var express = require('express');
var reddit = require('../lib/api/reddit');
var redditAnalyzer = require('../lib/analytics/reddit-analyzer');
var db = require('../lib/db');
var router = express.Router();

function pullRequestHandler(req, res, callback) {
  var subreddit = req.params.subreddit || "all";

  reddit.top(subreddit, function (body) {
    redditAnalyzer.process(body, function (body) {
      res.json(body);
      if (callback) {
        callback(body);
      }
    });
  });
}

router.get('/pull', function (req, res) {
  pullRequestHandler(req, res);
});

router.get('/pull/:subreddit', function (req, res) {
  pullRequestHandler(req, res);
});

router.post('/pull', function (req, res) {
  pullRequestHandler(req, res, db.store);
});

router.post('/pull/:subreddit', function (req, res) {
  pullRequestHandler(req, res, db.store);
});

module.exports = router;
