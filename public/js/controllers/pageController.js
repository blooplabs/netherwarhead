// Controller for navigating between pages
// Requires app.js to be imported first

controllers.controller("pageController", ["$scope",
  function pageController($scope) {
    $scope.templates = [
      { name: "chartsView.html", url: "chartsView.html"},
      { name: "aboutView.html", url: "aboutView.html"}
    ];
    $scope.template = $scope.templates[0];
  }]
);
