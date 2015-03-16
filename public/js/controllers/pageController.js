/*
 * Controller for navigating between pages
 * Requires app.js to be imported first
 */

controllers.controller("pageController", ["$scope",
  function pageController($scope) {

    // Set up site-wide template
    $scope.templates = {
      "chartsView": "views/chartsView.html",
      "aboutView": "views/aboutView.html"
    };
    $scope.template = $scope.templates.chartsView;
    $scope.isActive = function (templateUrl) {
        return templateUrl === $scope.template;
    };

    // Set up chart report templates
    $scope.chartTemplates = {
      "all": "views/reports/allCharts.html",
      "subreddit": "views/reports/subredditCharts.html"
    };
    $scope.chartTemplate =  $scope.templates.chartsView;

  }]
);
