var pageController = function pageController($scope) {
      $scope.templates = [
        { name: "commentsView.html", url: "commentsView.html"},
        { name: "chartsView.html", url: "chartsView.html"}
      ];
      $scope.template = $scope.templates[0];
    };
