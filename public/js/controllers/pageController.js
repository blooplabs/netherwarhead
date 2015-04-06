/*
 * Controller for navigating between partial templates
 * Requires app.js to be imported first
 */

controllers.controller("pageController", ["$scope", "$location",
  function pageController($scope, $location) {
    /*
     * Set up site-wide templates
     */
    $scope.isActive = function(route) {
        return route === $location.path();
    };

    /*
     * Set up chart report templates
     */
    $scope.chartTemplates = {
      "all": "views/reports/allCharts.html",
      "subreddit": "views/reports/subredditCharts.html"
    };
    $scope.chartTemplate = "views/chartsView.html";

  }]
);
