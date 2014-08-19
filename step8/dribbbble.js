var app = angular.module("dribbbbleApp", ["ngRoute"]);

app.config(function($routeProvider) {
  $routeProvider.when("/", {
    templateUrl: "shotsList.html"
  });

  $routeProvider.when("/:shotId", {
    controller: "ViewShotController",
    templateUrl: "shot.html",
    resolve: {
      shot: function($route, $http) {
        var shotId = $route.current.params.shotId;
        $http.jsonp("http://api.dribbble.com/shots/" + shotId + "?callback=JSON_CALLBACK").then(function(response) {
          return response.data;
        });
      }
    }
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

app.controller("ViewShotController", function($scope, shot) {
  $scope.shot = shot;
});
