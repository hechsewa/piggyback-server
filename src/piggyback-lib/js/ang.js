var client = angular.module("client",[]);

client.controller("cliCtrl", function($scope){
    $scope.chat = [];
    $scope.sendmssg = function(){
        $scope.chat.push($scope.mssg);
    }
});
