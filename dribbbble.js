var app = angular.module("dribbbble", ["ngRoute", "ngSanitize"]);

app.config(function($routeProvider) {
  $routeProvider.when("/", {
    controller: "ListShotsController",
    templateUrl: "shotsList.html"
  });

  $routeProvider.when("/:shotId", {
    controller: "ViewShotController",
    templateUrl: "shot.html",
    resolve: {
      shot: function($route, dribbleService) {
        return dribbleService.findShot($route.current.params.shotId);
      }
    }
  });

  $routeProvider.otherwise({ redirectTo: "/" });
});

app.controller("ListShotsController", function($scope, dribbleService) {
  $scope.listTypes = ["popular", "debuts", "everyone"];

  $scope.selectedListType = "popular";

  $scope.$watch("selectedListType", function(selectedListType) {
    $scope.isLoading = true;

    dribbleService.listShots(selectedListType).then(function(shots) {
      $scope.isLoading = false;
      $scope.shots = shots;
    });
  });
});

app.controller("ViewShotController", function($scope, shot, dribbleService) {
  $scope.shot = shot;

  $scope.isLoading = true;
  dribbleService.listComments(shot.id).then(function(comments) {
    $scope.isLoading = false;

    $scope.comments = comments;
  });
});

app.filter("playerLinks", function() {
  return function(text) {
    return text.replace(/@\[(\d+):(.+?)\]/g, function(match, id, name) {
      return "<a href='#/player/"+ id +"'>"+ name +"</a>";
    });
  };
});

app.filter("timeAgo", function() {
  var tenMinutes = 10 * 60 * 1000,
      thirtyMinutes = 20 * 60 * 1000,
      oneHour = 60 * 60 * 1000,
      oneDay = 24 * oneHour;

  return function(date) {
    var difference = Date.now() - date;

    if (difference > oneDay) return "A mais de um dia atrás";
    if (difference > oneHour) return "A mais de uma hora atrás";
    if (difference > thirtyMinutes) return "A mais de 30 minutos atrás";
    if (difference > tenMinutes) return "A mais de 10 minutos atrás";

    return "A minutos atrás";
  };
});

app.factory("dribbleService", function($http, Shot, Player, Comment) {
  var request = function(path) {
    return $http.jsonp("http://api.dribbble.com/" + path + "?callback=JSON_CALLBACK");
  };

  function parseShot(shot) {
    return new Shot({
      id: shot.id,
      title: shot.title,
      imageUrl: shot.image_url,
      thumbUrl: shot.image_teaser_url,
      description: shot.description,
      url: shot.url,
      viewsCount: shot.views_count,
      likesCount: shot.likes_count,
      commentsCount: shot.comments_count,
      player: parsePlayer(shot.player)
    });
  }

  function parsePlayer(player) {
    return new Player({
      id: player.id,
      name: player.name,
      username: player.username,
      avatarUrl: player.avatar_url
    });
  }

  function parseComment(comment) {
    return new Comment({
      body: comment.body,
      player: parsePlayer(comment.player),
      createdAt: Date.parse(comment.created_at),
      likeCount: comment.likes_count
    });
  }

  return {
    listShots: function(listType) {
      listType = listType || "popular";

      return request("shots/" + listType).then(function(response) {
        return response.data.shots.map(function(shot) {
          return parseShot(shot);
        });
      });
    },

    findShot: function(shotId) {
      return request("shots/" + shotId).then(function(response) {
        return parseShot(response.data);
      });
    },

    listComments: function(shotId) {
      return request("shots/" + shotId + "/comments").then(function(response) {
        return response.data.comments.map(function(comment) {
          return parseComment(comment);
        });
      });
    }
  };
});

app.factory("Shot", function() {
  return function Shot(params) {
    this.id = params.id;
    this.title = params.title;
    this.imageUrl = params.imageUrl;
    this.thumbUrl = params.thumbUrl;
    this.description = params.description;
    this.url = params.url;
    this.viewsCount = params.viewsCount;
    this.likesCount = params.likesCount;
    this.commentsCount = params.commentsCount;
    this.player = params.player;
  };
});

app.factory("Player", function() {
  return function Player(params) {
    this.id = params.id;
    this.name = params.name;
    this.username = params.username;
    this.avatarUrl = params.avatarUrl;
  };
});

app.factory("Comment", function() {
  return function Comment(params) {
    this.body = params.body;
    this.player = params.player;
    this.createdAt = params.createdAt;
    this.likesCount = params.likesCount;
  };
});