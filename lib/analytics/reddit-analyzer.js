/*jshint node:true */
"use strict";

var utils = require('./utils');

function analyze(redditJson) {
  var i;
  var stats = {
    subreddit: {},
    author: {},
    domain: {},
    ngram: {},
    is_self: {},
    gilded: 0,
    num_comments: 0,
    score: 0
  };

  // We're expecting the structure of redditJson to resemble the following:
  //  {
  //    "kind": "Listing"
  //    "data": {
  //      "children": [{
  //        "kind": "t3"
  //        "data": {
  //          "domain":
  //          "subreddit":
  //          "gilded":
  //          "author":
  //          "num_comments":
  //          "score":
  //          "is_self":
  //          "title":
  //          "created_utc":
  //        }
  //      }]
  //    }
  //  }
  // Ensure the json payload has a data and data.children property.
  if (redditJson.data && redditJson.data.children) {
    // Iterate through and examine each of the t3 posts in data.children.
    for (i = 0; i < redditJson.data.children.length; i++) {
      aggregateStatsByGroup(stats, "subreddit", redditJson.data.children[i].data);
      aggregateStatsByGroup(stats, "author", redditJson.data.children[i].data);
      aggregateStatsByGroup(stats, "domain", redditJson.data.children[i].data);
      aggregateStatsByGroup(stats, "is_self", redditJson.data.children[i].data);

      aggregateStatsByNgram(stats, 1, redditJson.data.children[i].data);
      aggregateStatsByNgram(stats, 2, redditJson.data.children[i].data);
      aggregateStatsByNgram(stats, 3, redditJson.data.children[i].data);

      stats.gilded += redditJson.data.children[i].data.gilded;
      stats.num_comments += redditJson.data.children[i].data.num_comments;
      stats.score += redditJson.data.children[i].data.score;
    }
  }

  console.log(stats);

  return stats;
}

// Aggregates various stats (e.g. gilded, num_comments, score) by group (e.g. subreddit, author, domain).
function aggregateStatsByGroup(stats, group, data) {
  if (!stats[group][data[group]]) {
    stats[group][data[group]] = {};
  }

  if (!stats[group][data[group]].count) {
    stats[group][data[group]].count = 0;
  }
  stats[group][data[group]].count++;

  if (!stats[group][data[group]].gilded) {
    stats[group][data[group]].gilded = 0;
  }
  stats[group][data[group]].gilded += data.gilded;

  if (!stats[group][data[group]].num_comments) {
    stats[group][data[group]].num_comments = 0;
  }
  stats[group][data[group]].num_comments += data.num_comments;

  if (!stats[group][data[group]].score) {
    stats[group][data[group]].score = 0;
  }
  stats[group][data[group]].score += data.score;

  return stats;
}

// Aggregates count for n-grams.
function aggregateStatsByNgram(stats, n, data) {
  var i;
  var ngroup = n + "-gram";
  var ngrams = utils.toNgrams(data.title, n);

  if (!stats.ngram[ngroup]) {
    stats.ngram[ngroup] = {};
  }

  for (i = 0; i < ngrams.length; i++) {
    if (!stats.ngram[ngroup][ngrams[i]]) {
      stats.ngram[ngroup][ngrams[i]] = 0;
    }
    stats.ngram[ngroup][ngrams[i]]++;
  }
}

var redditAnalyzer = {
  process: function (redditJson, callback) {
    redditJson.stats = analyze(redditJson);

    if (callback) {
      callback(redditJson);
    }
  }
};

module.exports = redditAnalyzer;
