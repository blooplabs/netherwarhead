// Controller for navigating between pages
// Requires app.js to be imported first

controllers.controller("pageController", ["$scope",
  function pageController($scope) {
    $scope.templates = [
      { name: "commentsView.html", url: "commentsView.html"},
      { name: "chartsView.html", url: "chartsView.html"}
    ];
    $scope.template = $scope.templates[0];
  }]
);
