var client = angular.module("client",[]);

client.controller("cliCtrl", ['$scope', '$http', function($scope, $http){
    $scope.events = [];
    //$scope.ip='';

    //create Iterator for json object
    function Iterator(json){
      var strEvent = [];
      for(var key in json){
        if( !json.hasOwnProperty(key) || key==='name') continue;
        //dla kazdej wartosci z obiektu json: dodaj do tablicy, wydrukuj w konsoli
        strEvent.push(json[key]);
        $scope.events.push(json[key]);
        //console.log(json[key]);
      }
    }
    //get client's ip address
    /*$http.get("https://ipinfo.io/json").then(function (response)
		{
			$scope.ip = response.data.ip;
		});*/

    //wygeneruj id do odrozniania klientow
    function makeid() {
      $scope.text = "";
      var possible = "abcdefghijklmnopqrstuvwxyz";
      for (var i = 0; i < 3; i++)
        $scope.text += possible.charAt(Math.floor(Math.random() * possible.length));
      return $scope.text;
    }
    $scope.cnt=0;
    $scope.id = makeid();
    //send a request to server
    $scope.sendRequest = function(){
        $scope.cnt += 1;
        $scope.clientid = $scope.id+$scope.cnt;
        $scope.events = [];
        var timeNow = new Date();
        var url = '/add/ButtonClicked/'+$scope.clientid+'/';
        //zaladuj obiekt ktory zwroci url servera
        $http.get(url).then(function(res){
          var events = Iterator(res.data);
          //console.log(events);
          //$scope.events.push(events);
        });
    }
}]);
