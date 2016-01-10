var qcApi = require('QC.js/qcApi.js').create();
var userpass = require('./.userpass.json');

qcApi.login({
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
});
