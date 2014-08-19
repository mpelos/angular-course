var app = angular.module("dribbbbleApp", []);

app.controller("ListShotsController", function($scope) {
  $scope.shots = [
    {
      player: "antematijaca",
      thumbUrl: "https://d13yacurqjgara.cloudfront.net/users/315798/screenshots/1688408/quotes_teaser.jpg"
    }, {
      player: "JustinMezzell",
      thumbUrl: "https://d13yacurqjgara.cloudfront.net/users/13774/screenshots/1688779/avatars_teaser.png"
    }, {
      player: "slaterdesign",
      thumbUrl: "https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/1688947/corgi_teaser.png"
    }, {
      player: "yoga",
      thumbUrl: "https://d13yacurqjgara.cloudfront.net/users/332776/screenshots/1688250/hm-dribbble_teaser.jpg"
    }
  ];
});
