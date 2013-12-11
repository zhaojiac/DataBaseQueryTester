var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : 'localhost',
  port	   : '8889',
  user     : 'root',
  password : 'root',
  connectionLimit : '10'
});

var sum = 0;
var queueSize = 10000;
var endcount = 0;

var RandomInteger = function(n, m) {
    if (! m) {m = 1;} // default range starts at 1
    var max = n > m ? n : m; // doesn<q>t matter which value is min or max
    var min = n === max ? m : n; // min is value that is not max
    var d = max - min + 1; // distribution range
    return Math.floor(Math.random() * d + min);
};

var getCount = function(id,start){
	return function(err,connection){

	        var sql = "SELECT * FROM ?? WHERE ?? = ?";
		var inserts = ['WRKLGHT.GADGET_USER_PREF', 'ID', id];
		var requestTime = new Date().getTime();
		sql = mysql.format(sql, inserts);
	   	
		connection.query(sql, function(err, result) {
			
			connection.release();
			endcount++;
			if (err) {

			} else {
				endcount++;
				var currentResponse = new Date().getTime() - requestTime;
				//console.log("Actual start time is " + start);
				sum += currentResponse;
				if(endcount === queueSize){
					console.log("The time sum is: " + sum +"ms");
					console.log("The Queue size is : " + queueSize);
					var avg = sum/queueSize;	
					console.log("The avg response time is ",avg," ms");
				}
				//responseTime[arrayId] = endTime - responseTime[arrayId];
				//console.log(responseTime[arrayId]);
			}

		});
	}
};


for (var count = 0; count < queueSize; count++) {

	var id = RandomInteger(0,400000) ;
	//console.log(id);
	var start = new Date().getTime();
	//console.log("Start Time is ", start, "ms");
	pool.getConnection(getCount(id,start));

}
