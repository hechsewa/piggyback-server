var client = angular.module("client",[]);

client.controller("cliCtrl", ['$scope', '$http', function($scope, $http){
    $scope.events = [];

    //push events from json object to html, each by each
    function pushEvents(json){
      var strEvent = [];
      for(var key in json){
        if( !json.hasOwnProperty(key) || key==='name') continue;
        //dla kazdej wartosci z obiektu json: dodaj do tablicy i do html
        strEvent.push(json[key]);
        $scope.events.push(json[key]);
      }
    }

    //generate unique client id

    function makeid() {
      $scope.text = "";
      var possible = "abcdefghijklmnopqrstuvwxyz";
      for (var i = 0; i < 3; i++)
        $scope.text += possible.charAt(Math.floor(Math.random() * possible.length));
      return $scope.text;
    }


    $scope.id = makeid();
    //send a get request to server
    /*
    $scope.sendRequest = function(){
        $scope.clientid = $scope.id;
        $scope.events = [];
        var timeNow = new Date();
        $scope.msg = '['+$scope.clientid+'] Sent request at '+timeNow;
        $scope.text = $scope.msg;
        var url = '/add/'+$scope.clientid+'/'+$scope.text+'/';
        //zaladuj obiekt ktory zwroci url servera
        $http.get(url).then(function(res){
          var events = pushEvents(res.data);
        });
    }*/

    //send a post request
    $scope.sendRequest = function() {
      $scope.clientid = $scope.id;
      $scope.events = [];
      var timeNow = new Date();
      var url = '/';
      var data = {
        ident: $scope.clientid,
        text: '['+$scope.clientid+'] Sent request at '+timeNow
      };
      $http.post(url, data).then(function(res){
        var events = pushEvents(res.data);
      });
    }
}]);
