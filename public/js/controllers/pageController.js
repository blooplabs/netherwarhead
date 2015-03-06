/* Controller for navigating between pages
 * Requires app.js to be imported first
 */

controllers.controller("pageController", ["$scope",
  function pageController($scope) {
    $scope.templates = {
      "chartsView": "chartsView.html",
      "aboutView": "aboutView.html"
    };

    $scope.template = $scope.templates.chartsView;

    $scope.isActive = function (templateUrl) {
        return templateUrl === $scope.template;
    };
  }]
);
