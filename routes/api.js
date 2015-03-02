var express = require('express');
var reddit = require('../lib/api/reddit');
var redditAnalyzer = require('../lib/analytics/reddit-analyzer');
var router = express.Router();

router.get('/pull', function (req, res, next) {
  reddit.top("all", function (body) {
    redditAnalyzer.process(body, function (body) {
      res.json(body);
    });
  });
});

module.exports = router;
