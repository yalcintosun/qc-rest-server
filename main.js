var express = require('express');
var app = express();

var qcApi = require('QC.js/qcApi.js').create();
var userpass = require('./.userpass.json');
//var testset = [];

/*qcApi.login({
    "server": "http://gbplqc101.genband.com:8080/qcbin",
    "domain": "BBN",
    "project": "CA_CM9500_v1_2",
    "user": userpass.username,
    "password": userpass.password
}).then(
function(){
    console.log("successfully logged in!");
	qcApi.get('/tests/', {pageSize: '10'})
	.then(function(tests){
		console.log("got " + tests.length + " tests");
		console.log(tests[0]);
	},
	function(err) { console.log("something failed: " + err) });
}, function(err){
    console.log("oh shit, something went awry!")
});*/

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    res.send(/*toJSON.stringify(tests)*/"Hello World");
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})