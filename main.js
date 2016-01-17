var express = require('express');
var app = express();

var qcApi = require('QC.js/qcApi.js').create();
var userpass = require('./.userpass.json');
var rootTestFolder = 'SPiDR 4.0';

qcApi.login({
    "server": "http://gbplqc101.genband.com:8080/qcbin",
    "domain": "BBN",
    "project": "CA_CM9500_v1_2",
    "user": userpass.username,
    "password": userpass.password
}).then(
function(){
    console.log("successfully logged in!");
    getRootFolderInfo(rootTestFolder,function(hPath){
        qetAutomatedFolders(hPath,function(automatedFolders){
            console.log("Now printing parsed automated folder list");
            var parsedAutomatedFolders = JSON.parse(automatedFolders);
            console.log(parsedAutomatedFolders);
            //find absolute path of automated folders
            for (var af = 0; af < parsedAutomatedFolders.length; af++) {
                var pathList = [];
                getParentFolder(parsedAutomatedFolders[af].id, function (parentFolder) {
                    console.log("Now printing folder details");
                    console.log(parentFolder);
                })
                //TODO: How will I put the folder id's to a list? Promises?
                //console.log(pathList);
            }
        });
    });
}, function(err){
    console.log("oh shit, something went awry!" + err);
});

//FUNCTIONS

function getRootFolderInfo(folderName, callback) {
    qcApi.get("/test-folders?query={name['" + folderName + "']}", {'fields': ['id','hierarchical-path']})
        .then(function(folders){
            console.log("In getRootFolderInfo:");
            console.log(folders[0]);
            var p = JSON.parse(JSON.stringify(folders[0]));
            callback(p['hierarchical-path']);
        },
        function(err) { console.log("something failed: " + err) });
}

function qetAutomatedFolders(hPath, callback) {
    qcApi.get("/test-folders?query={name['automated'];hierarchical-path["+hPath+"*]}", {'fields': ['id','hierarchical-path']})
        .then(function(folders){
            console.log("In getAutomatedFolders:");
            console.log(folders[0]);
            callback(JSON.stringify(folders));
        },
        function(err) { console.log("something failed: " + err) });
}

function getParentFolder(automatedFolderID, callback) {
    qcApi.get("/test-folders/" + automatedFolderID)
        .then(function(folder){
            var parsedParentFolder = JSON.parse(JSON.stringify(folder));
            var parsedField = parsedParentFolder.Entity.Fields[0].Field;
            for (var i = 0; i < parsedField.length; i++) {
                if (parsedField[i].$.Name === "parent-id") {
                    callback(parsedField[i].Value);
                }
            }
        },
        function(err) { console.log("something failed: " + err)
        }).then(console.log, console.error);
}




// EXPRESS SERVER SECTION
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req, res) {
    qcApi.get("/test-folders?query={name['automated']}", {'fields': ['id','hierarchical-path']})
        .then(function(folders){
            console.log("got " + folders.length + " folders");
            console.log(folders[0]);
            res.send(JSON.stringify(folders));
        },
        function(err) { console.log("something failed: " + err) });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})
