var app = angular.module("netherWarhead", [
  "ngRoute",
  "netherWarhead.controllers",
  "netherWarhead.services",
  "netherWarhead.directives"
]);
var services = angular.module("netherWarhead.services", []);
var controllers = angular.module("netherWarhead.controllers", []);
var directives = angular.module("netherWarhead.directives", []);

app.config(["$routeProvider",
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/chartsView.html',
        controller: 'pageController'
      }).
      when('/about', {
        templateUrl: 'views/aboutView.html',
        controller: 'aboutController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
