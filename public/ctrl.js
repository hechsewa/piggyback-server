var client = angular.module("client",[]);

client.controller("cliCtrl", ['$scope', '$http', function($scope, $http){
    $scope.log = [];

    //create Iterator for json object
    function Iterator(json){
      var strEvent = [];
      for(var key in json){
        if( !json.hasOwnProperty(key)) continue;
        //dla kazdej wartosci z obiektu json: dodaj do tablicy, wydrukuj w konsoli
        strEvent.push(json[key]);
        console.log(json[key]);
      }
      return strEvent;
    }

    //send a request to server
    $scope.sendRequest = function(){
        var timeNow = new Date();
        var url = '/add/ButtonClicked/';
        //zaladuj obiekt ktory zwroci url servera
        $http.get(url).then(function(res){
          var events = Iterator(res.data);
          //console.log(events);
          $scope.log.push(events);
        });
        //i tu wrzucamy sobie ta odpowiedz i nowe eventy
        //$scope.chat.push($scope.mssg);
    }
}]);
