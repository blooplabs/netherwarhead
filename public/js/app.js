var app = angular.module("netherWarhead", []);
var services = angular.module("netherWarhead.services", []);
var controllers = angular.module("netherWarhead.controllers",
  ["netherWarhead.services"]
);
