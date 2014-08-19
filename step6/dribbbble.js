var app = angular.module("dribbbbleApp", []);

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
