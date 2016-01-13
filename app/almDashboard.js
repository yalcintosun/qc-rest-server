/**
 * Created by yalcintosun on 13/01/16.
 */
var app = angular.module('almDashboard', []);

app.controller('selectCtrl', function() {
    var selection = this;

    selection.folders = [{"folderName": "f1"}, {"folderName": "f2"}];

});