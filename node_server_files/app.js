// const http = require('http');
// const hostname = '127.0.0.1';
// const port = 3000;
//
//
// var express = require('express');
// var app = express();
// var mysql = require('mysql');
//
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "inamorata1"
// });
//
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });
//
// app.get('/update', function(req, res) {
// 	var query = 'INSERT INTO locations (location_id, data_id) VALUES ('$location_id','$time');';
// 	db.any(query)
//         .then(function (rows) {
//             res.render('pages/home',{
// 				my_title: "Home Page",
// 				data: rows,
// 				color: '',
// 				color_msg: ''
// 			})
//
//         })
//         .catch(function (err) {
//             // display error message in case an error
//             req.flash('error', err); //if this doesn't work for you replace with console.log
//             res.render('pages/home', {
//                 title: 'Home Page',
//                 data: '',
//                 color: '',
//                 color_msg: ''
//             })
//         })
// });
//
// app.listen(port, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
//things being sent in
//decibel VALUES
//time of reading
//location of reading

//processing

//take v
'use strict';

const express = require('express'); // Add the express framework
const app = express();
const request = require('request');
const bodyParser = require('body-parser'); // Add the body-parser tool
app.use(bodyParser.json());              // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies

const pug = require('pug'); // Add pug


let options = {
    "db": 40,
    "id": 1
};

//request.post(options, callback);

//Create Database Connection
//const pgp = require('pg-promise')();
var mysql = require('mysql');
const con = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'inamorata1',
  database: 'locations'
});

con.connect((err) => {
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});



app.engine('pug', require('pug').__express)

//sets pug as view engine
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/'));

// home page
app.get('/home', function(req, res) {
	var query = 'select * from locations'; // select all locations and their latest reading
  con.query(query, (err, rows) => {

      if(err) throw err;
       //has the latest_decibel values for each location.
      console.log(rows)
      var latest_value = 'select temp_table.location_id, data_value, data_id from data full join (select locations.location_id, MAX(data_id) max_data from locations left join data on data.location_id = locations.location_id group by locations.location_id order by locations.location_id asc)temp_table on data_id=temp_table.max_data;';
      var j = 1;
      con.query(latest_value, function (err, latest_decibel){
        if(err) throw err;
        console.log(rows.length);
        for(var i=1; i<=rows.length; i++){
          var std =  'select stddev(data_value) from (select data_value from data where data.location_id='+i+') as alias_table;'
          var avg = 'select AVG(data_value) from (select data_value from data where data.location_id='+i+') as alias_table;'

          con.query(std, function(err, std_result){

            if(err) throw err;

            std_result = std_result[0]['stddev(data_value)'];
            con.query(avg, function(err, avg_result){
                avg_result = avg_result[0]['AVG(data_value)'];
                console.log(j);
                var db = latest_decibel[j-1]['data_value'];
                console.log(db);

                console.log(avg_result+std_result);
                console.log(avg_result-std_result);
                if(db >= avg_result+std_result){
                  var status_update = 'update locations set status="busy" where location_id =' + j+';';
                  con.query(status_update, (err, result) =>{
                    if(err) throw err;

                  });
                } else if(db < avg_result+std_result && db > avg_result-std_result){
                  var status_update = 'update locations set status="normal" where location_id =' + j+';';
                  con.query(status_update, (err, result) =>{
                    if(err) throw err;

                  });
                } else {
                  var status_update = 'update locations set status="quiet" where location_id =' + j+';';
                  con.query(status_update, (err, result) =>{
                    if(err) throw err;

                  });
                }
                j++;
              });

          });
        }
        con.query(query, (err, rows) =>{
          res.render('pages/home', {
    				page_title: 'Home',
    				data: rows,
            decibel_readings: latest_decibel,
    			})
        });

      });

      //is it busy?



		});
});

// location page
app.get('/location', function(req, res) {
	res.render('pages/location',{
		page_title:"Location Name"
	});
});

app.get('/admin/update/:db/:id', function(req, res) {
	res.render('pages/admin',{
		page_title:"admin",
    decibel_value:req.params.db,
    location_id:req.params.id,
	});
  var query = 'insert into locations(location_id) values ('+req.params.id+')';
  con.query(query, function (err, result){
    console.log('locations table modified');
  });
  var query = 'insert into data(location_id, data_time, data_value) values ('+req.params.id+', NOW(), '+req.params.db+')';
  con.query(query, function (err, result){
    if(err) throw err;
    console.log('data table modified');
  });
});

var port = 2048;
app.listen(port);
console.log('listening on port ' + port);
