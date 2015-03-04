controllers.controller("dataController", ["$scope", "$http", "dataAnalyzer",
  function dataController($scope, $http, dataAnalyzer) {
    $scope.dataPull = function() {
      $http({
        method: "GET",
        url: "/api/pull"

      }).success(function(data) {
        dataAnalyzer.extractData($scope, data);

      }).error(function(data) {
        $scope.num_comments = null;
        console.log(data);

      });
    };
  }]
);
