var app = angular.module('myApp', []);

app.controller('mainController', function($scope){  //scope - links controller to view
    $scope.comments = [];
    $scope.newComment = {author: '', title: '', text: '', when: ''};

    $scope.comment = function(){
        $scope.newComment.when = Date.now();
        $scope.comments.push($scope.newComment);    //adding comment to $scope.comments
        $scope.newComment = {author: '', title: '', text: '', when: ''};
      };
    
});

app.controller('authController', function($scope){
    $scope.user = {username: '', password: ''};
    $scope.error_message = '';
  
    postService.getAll().success(function(data){
      $scope.comments = data;
    });

    $scope.login = function(){
        //placeholder until authentication is implemented
        $scope.error_message = 'login request for ' + $scope.user.username;
      };
    
      $scope.register = function(){
        //placeholder until authentication is implemented
        $scope.error_message = 'registeration request for ' + $scope.user.username;
      };
});
