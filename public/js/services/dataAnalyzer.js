/*
 * Service for analyzing data from the server
 * Requires app.js to be imported first
 */

services.factory("dataAnalyzer", function() {
  /*
   * For use with the sort() method, sorts by descending
   * value and then alphabetically, disregarding capitalization
   */
  var sortDescending = function(a, b) {
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
  };

  /*
   * Extract compositional data from server data
   * @param {String} type - Type of data to be extracted, can be one of
   *                        ["subreddit", "domain", "author"]
   */
  var extractChartData = function(scope, data, type) {
    // Create sortable arrays of objects: {type, value}
    var postsArray = [];
    var scoreArray = [];
    var gildedArray = [];
    for (var post in data.stats[type]) {
      // Save post count
      postsArray.push({
        name: post,
        value: data.stats[type][post].count
      });
      // Save post score
      scoreArray.push({
        name: post,
        value: data.stats[type][post].score
      });
      // Save gilded count
      gildedArray.push({
        name: post,
        value: data.stats[type][post].gilded
      });
    }

    // Sort data before returning
    postsArray.sort(sortDescending);
    scoreArray.sort(sortDescending);
    gildedArray.sort(sortDescending);

    return {
      posts: postsArray,
      score: scoreArray,
      gilded: gildedArray
    };
  };

  return {
    chartData: function(scope, data, type) {
      return extractChartData(scope, data, type);
    }
  };
});
