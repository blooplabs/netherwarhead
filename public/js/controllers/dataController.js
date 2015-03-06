/* Controller for getting data from the server
 * Requires app.js to be imported first
 * Depends on dataAnalyzer.js
 */

controllers.controller("dataController", ["$scope", "$http", "dataAnalyzer",
  function dataController($scope, $http, dataAnalyzer) {

    // Pulls reddit data from server
    $scope.dataPull = function() {
      $http({
        method: "GET",
        url: "/api/pull"

      }).success(function(data) {
        console.log(data.stats);

        // Extract comments
        dataAnalyzer.extractComments($scope, data);

        // Extract subreddit data
        subData = dataAnalyzer.chartData($scope, data, "subreddit");
        $scope.postsBySub = subData.posts;
        $scope.scoreBySub = subData.score;

        // Extract domain data
        domainData = dataAnalyzer.chartData($scope, data, "domain");
        $scope.postsByDomain = domainData.posts;
        $scope.scoreByDomain = domainData.score;

        // Extract author data
        authorData = dataAnalyzer.chartData($scope, data, "author");
        $scope.postsByAuthor = authorData.posts;
        $scope.scoreByAuthor = authorData.score;

        console.log(subData);
        console.log(domainData);
        console.log(authorData);

      }).error(function(data) {
        // Number of comments set to 0
        $scope.num_comments = null;
        console.log(data);
      });
    };

    // Pull data from server
    $scope.dataPull();
  }]
);
