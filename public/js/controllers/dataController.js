/*
 * Controller for getting data from the server
 * Requires app.js to be imported first
 * Depends on dataAnalyzer.js
 */

controllers.controller("dataController", ["$scope", "$http", "dataAnalyzer",
  function dataController($scope, $http, dataAnalyzer) {

    $scope.currentSub = "/r/all";

    // Pulls reddit data from server
    $scope.dataPull = function(chosenSub) {
      var fullUrl = "/api/pull";

      // Determine which subreddit to query
      if (typeof chosenSub !== "undefined") {
        // If valid subreddit was passed in, use it in the API URI
        fullUrl = fullUrl + "/" + chosenSub;

        // Set currentSub and chartTemplate
        $scope.currentSub = "/r/" + chosenSub;
        $scope.chartTemplate = $scope.chartTemplates.subreddit;

      } else {
        // Set currentSub and chartTemplate
        $scope.currentSub = "/r/all";
        $scope.chartTemplate = $scope.chartTemplates.all;
      }

      // Clear all current saved data
      clearData();

      $http({
        method: "GET",
        url: fullUrl

      }).success(function(data, status, headers, config) {
        // Extract subreddit data
        subData = dataAnalyzer.chartData($scope, data, "subreddit");
        $scope.postsBySub = subData.posts;
        $scope.scoreBySub = subData.score;
        $scope.gildedBySub = subData.gilded;

        // Extract domain data
        domainData = dataAnalyzer.chartData($scope, data, "domain");
        $scope.postsByDomain = domainData.posts;
        $scope.scoreByDomain = domainData.score;
        $scope.gildedByDomain = domainData.gilded;

        // Extract author data
        authorData = dataAnalyzer.chartData($scope, data, "author");
        $scope.postsByAuthor = authorData.posts;
        $scope.scoreByAuthor = authorData.score;
        $scope.gildedByAuthor = authorData.gilded;

      }).error(function(data, status, headers, config) {
        console.log("Error getting data from server, status: " + status);
      });
    };

    // Pull data from server, initially from /r/all
    $scope.dataPull();

    // Clears all data sets, which will make the charts appear to load
    function clearData() {
        $scope.postsBySub = null;
        $scope.scoreBySub = null;
        $scope.gildedBySub = null;
        $scope.postsByDomain = null;
        $scope.scoreByDomain = null;
        $scope.gildedByDomain = null;
        $scope.postsByAuthor = null;
        $scope.scoreByAuthor = null;
        $scope.gildedByAuthor = null;
    }
  }]
);
