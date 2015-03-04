// Controller for getting data from the server
// Requires app.js to be imported first
// Depends on dataAnalyzer.js

controllers.controller("dataController", ["$scope", "$http", "dataAnalyzer",
  function dataController($scope, $http, dataAnalyzer) {

    // Pulls reddit data from server
    $scope.dataPull = function() {
      $http({
        method: "GET",
        url: "/api/pull"

      }).success(function(data) {
        // Sends data to the data analyzer service for formatting
        dataAnalyzer.extractData($scope, data);

      }).error(function(data) {
        // Number of comments set to 0
        $scope.num_comments = null;
        console.log(data);

      });
    };

    $scope.myData = [
      {name: "Locke",    value:  4},
      {name: "Reyes",    value:  8},
      {name: "Ford",     value: 15},
      {name: "Jarrah",   value: 16},
      {name: "Shephard", value: 23},
      {name: "Kwon",     value: 42}
    ];

  }]
);
