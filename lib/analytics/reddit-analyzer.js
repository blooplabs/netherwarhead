"use strict";

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
      analyzeHelper(stats, "subreddit", redditJson.data.children[i].data);
      analyzeHelper(stats, "author", redditJson.data.children[i].data);
      analyzeHelper(stats, "domain", redditJson.data.children[i].data);
      analyzeHelper(stats, "is_self", redditJson.data.children[i].data);

      stats.gilded += redditJson.data.children[i].data.gilded;
      stats.num_comments += redditJson.data.children[i].data.num_comments;
      stats.score += redditJson.data.children[i].data.score;
    }
  }

  console.log(stats);

  return stats;
};

// Aggregates various stats (e.g. gilded, num_comments, score) by group (e.g. subreddit, author, domain).
function analyzeHelper(stats, group, data) {
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
};

var redditAnalyzer = {
  process: function (redditJson, callback) {
    redditJson.stats = analyze(redditJson);

    if (callback) {
      callback(redditJson);
    }
  }
};

module.exports = redditAnalyzer;
