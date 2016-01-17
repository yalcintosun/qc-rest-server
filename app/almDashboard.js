/**
 * Created by yalcintosun on 13/01/16.
 */
var app = angular.module('almDashboard', []);

app.controller('selectCtrl', function($http) {
    var selection = this;

    $http.get("http://localhost:3000").then(function(response) {
        var f1 = response.data;
        console.log(f1);
        selection.folders = [{"folderName": f1[0].id}, {"folderName": "f2"}];
    });



});