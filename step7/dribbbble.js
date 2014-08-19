var app = angular.module("dribbbbleApp", ["ngRoute"]);

app.config(function($routeProvider) {
  $routeProvider.when("/", {
    templateUrl: "shotsList.html"
  });

  $routeProvider.when("/:shotId", {
    controller: "ViewShotController",
    templateUrl: "shot.html"
  });

  $routeProvider.otherwise({ redirectTo: "/" });
});

app.controller("ListShotsController", function($scope, $http) {
  $scope.listTypes = ["popular", "debuts", "everyone"];
  $scope.selectedListType = "popular";

  $scope.$watch("selectedListType", function(type) {
    $scope.isLoading = true;

    $http.jsonp("http://api.dribbble.com/shots/" + type + "?callback=JSON_CALLBACK").then(function(response) {
      $scope.shots = response.data.shots;
      $scope.isLoading = false;
    });
  });
});

app.controller("ViewShotController", function($scope, $routeParams, $http) {
  $http.jsonp("http://api.dribbble.com/shots/" + $routeParams.shotId + "?callback=JSON_CALLBACK").then(function(response) {
    $scope.shot = response.data;
  });
});
