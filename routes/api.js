/*jshint node:true */
"use strict";

var express = require('express');
var reddit = require('../lib/api/reddit');
var redditAnalyzer = require('../lib/analytics/reddit-analyzer');
var db = require('../lib/models/db');
var router = express.Router();

function getId(subreddit, currentTime) {
  return subreddit +
    "-" + currentTime.getUTCFullYear() +
    "-" + (currentTime.getUTCMonth() + 1) +
    "-" + currentTime.getUTCDate() +
    "-" + currentTime.getUTCHours();
}

function handleError(res, err) {
  console.log("Error encountered somewhere within the API Router.");
  console.log(err);
  res.status(500);
  res.json({"message": err.message});
}

// Query for the latest subreddit data from the database.
// If it doesn't exist - fetch it from reddit, process it, and store in the database.
function pullRequestHandler(req, res) {
  var subreddit = req.params.subreddit || "all";
  var currentTime = new Date();
  var id = getId(subreddit, currentTime);

  // Query the database for the latest subreddit data.
  db.queryById(id, function (err, queryResults) {
    if(err) {
      handleError(res, err);
    } else {
      if (queryResults) {
        // If it exists - place the results in the response.
        res.json(queryResults);
      } else {
        // Otherwise - fetch it directly from reddit.
        reddit.getTop(subreddit, currentTime, function (err, redditData) {
          if (err) {
            handleError(res, err);
          } else {
            // Process the results from reddit.
            redditData.id = id;
            redditAnalyzer.generateStats(redditData, function (err, processedData) {
              if (err) {
                handleError(res, err);
              } else {
                // Place the results in the response and store it in the database.
                res.json(processedData);
                db.store(processedData);
              }
            });
          }
        });
      }
    }
  });
}

router.all('/pull', function (req, res) {
  pullRequestHandler(req, res);
});

router.all('/pull/:subreddit', function (req, res) {
  pullRequestHandler(req, res);
});

module.exports = router;
