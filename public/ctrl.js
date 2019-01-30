var client = angular.module("client",[]);

client.controller("cliCtrl", ['$scope', '$http', function($scope, $http){
    $scope.events = [];

    //create Iterator for json object
    function Iterator(json){
      var strEvent = [];
      for(var key in json){
        if( !json.hasOwnProperty(key) || key==='name') continue;
        //dla kazdej wartosci z obiektu json: dodaj do tablicy, wydrukuj w konsoli
        strEvent.push(json[key]);
        $scope.events.push(json[key]);
        console.log(json[key]);
      }
    }

    //send a request to server
    $scope.sendRequest = function(){
        $scope.events = [];
        var timeNow = new Date();
        var url = '/add/ButtonClicked/';
        //zaladuj obiekt ktory zwroci url servera
        $http.get(url).then(function(res){
          var events = Iterator(res.data);
          //console.log(events);
          //$scope.events.push(events);
        });
        //i tu wrzucamy sobie ta odpowiedz i nowe eventy
        //$scope.chat.push($scope.mssg);
    }
}]);
