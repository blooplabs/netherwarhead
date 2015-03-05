// Service for analyzing data from the server
// Requires app.js to be imported first

services.factory("dataAnalyzer", function() {
  // Extract total number of comments in all posts
  var extractComments = function(scope, data) {
    var totalComments = data.stats.num_comments;
    console.log("Total comments: " + totalComments);
    scope.num_comments = totalComments;
  };

  // Extract data by subreddit
  var sortBySubreddit = function(scope, data) {
    console.log(data.stats);

    // Create sorable array of objects: {subreddit, count}
    var subArray = [];
    for (var sub in data.stats.subreddit) {
      subArray.push({
        name: sub,
        value: data.stats.subreddit[sub].count
      });
    }

    subArray.sort(function(a, b) {
      // Compare values for sorting
      var compare = b.value - a.value;

      // If values are equal, sort alphabetically by subreddit name
      if (compare === 0) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          compare = -1;
        } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
          compare = 1;
        } else {
          compare = 0;
        }
      }

      return compare;
    });

    scope.myData = subArray;

  };

  return {
    // Extracts data from the given JSON object
    extractComments: function(scope, data) {
      return extractComments(scope, data);
    },
    extractSubreddit: function(scope, data) {
      return sortBySubreddit(scope, data);
    }
  };
});
