var app = angular.module("dribbbbleApp", []);

app.controller("ListShotsController", function($scope, $http) {
  $scope.isLoading = true;

  $http.jsonp("http://api.dribbble.com/shots/popular?callback=JSON_CALLBACK").then(function(response) {
    $scope.shots = response.data.shots;
    $scope.isLoading = false;
  });
});
