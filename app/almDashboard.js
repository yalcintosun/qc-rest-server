/**
 * Created by yalcintosun on 13/01/16.
 */
var app = angular.module('almDashboard', []);

app.controller('selectCtrl', function($http) {
    var selection = this;
    var f1 = '';

    $http.get("http://localhost:3000").then(function(response) {
        f1 = response.data.toString();
        //console.log(f1);
    });

    console.log(f1);
    selection.folders = [{"folderName": f1}, {"folderName": "f2"}];

});