var express = require('express');
var app = express();

var qcApi = require('QC.js/qcApi.js').create();
var userpass = require('./.userpass.json');
var rootTestFolder = 'SPiDR 4.0';

var parentFoldersList = [];

qcApi.login({
    "server": "http://gbplqc101.genband.com:8080/qcbin",
    "domain": "BBN",
    "project": "CA_CM9500_v1_2",
    "user": userpass.username,
    "password": userpass.password
}).then(
function(){
    console.log("successfully logged in!");
    getRootFolderInfo(rootTestFolder)
    .then(function(hPath){
        qetAutomatedFolders(hPath)
        .then(function(automatedFolders){
            console.log("Now printing parsed automated folder list");
            var parsedAutomatedFolders = JSON.parse(automatedFolders);
            console.log(parsedAutomatedFolders);
            //find absolute path of automated folders
            var sequence = Promise.resolve();
            parsedAutomatedFolders.forEach(function(folder){
                sequence = sequence.then(function(){
                    return getParentFolder((folder.id));
                }).then(function(parentFolder){
                    parentFoldersList.push(parentFolder);
                    return parentFoldersList;
                });
            });
            sequence.then(function(list){console.log(list);});

          })//.then(function(pl){console.log(pl);});
        })
}, function(err){
    console.log("oh shit, something went awry!" + err);
});

/*
var storyPromise;

function getChapter(i) {
  storyPromise = storyPromise || getJSON('story.json');

  return storyPromise.then(function(story) {
    return getJSON(story.chapterUrls[i]);
  })
}

// and using it is simple:
getChapter(0).then(function(chapter) {
  console.log(chapter);
  return getChapter(1);
}).then(function(chapter) {
  console.log(chapter);
});
*/

//FUNCTIONS

function getRootFolderInfo(folderName) {
    return qcApi.get("/test-folders?query={name['" + folderName + "']}", {'fields': ['id','hierarchical-path']})
        .then(function(folders){
            console.log("In getRootFolderInfo:");
            console.log(folders[0]);
            var p = JSON.parse(JSON.stringify(folders[0]));
            return p['hierarchical-path'];
        },
        function(err) { console.log("something failed: " + err) });
}

function qetAutomatedFolders(hPath) {
    return qcApi.get("/test-folders?query={name['automated'];hierarchical-path["+hPath+"*]}", {'fields': ['id','hierarchical-path']})
        .then(function(folders){
            console.log("In getAutomatedFolders:");
            console.log(folders[0]);
            return JSON.stringify(folders);
        },
        function(err) { console.log("something failed: " + err) });
}

function getParentFolder(automatedFolderID) {
    return qcApi.get("/test-folders/" + automatedFolderID)
        .then(
          function(folder){
            var parsedParentFolder = JSON.parse(JSON.stringify(folder));
            var parsedField = parsedParentFolder.Entity.Fields[0].Field;
            for (var i = 0; i < parsedField.length; i++) {
                if (parsedField[i].$.Name === "parent-id") {
                    return parsedField[i].Value;
                }
            }
          },
          function(err) { console.log("something failed: " + err)
          });
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
