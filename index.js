var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var $http = require('axios');
var server = express();
var logger = require('./logger');
var authorize = require('./auth');


var port = process.env.PORT || 8080;
var apiKey = process.env.API || require('./config').apiKey;
var baseUrl = 'https://api.forecast.io/forecast/';

//plugins middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(cors());
server.use(logger);
server.use(authorize);


//test routes
server.get('/forecast/hourly/:lat,:lon', function(req, res){
  $http.get(baseUrl + apiKey + '/'+req.params.lat+','+req.params.lon)
       .then(function(response){
         var resObject = {
           latitude: response.data.latitude,
           longitude: response.data.longitude,
           hourly: response.data.hourly,
         };
         res.status(200).json(resObject);
       })
       .catch(function(error){
         res.status(500).send({
           msg: error
         });
       });
});


server.get('/forecast/minutely/:lat,:lon', function(req, res){
  $http.get(baseUrl + apiKey + '/'+req.params.lat+','+req.params.lon)
       .then(function(response){
         var resObj = {
           latitude: response.data.latitude,
           longitude: response.data.longitude,
           minutely: response.data.minutely,
         };
         res.status(200).json(resObj);
       })
       .catch(function(error){
         res.status(500).send({
           msg: error
         });
       });
    });

server.get('/forecast/daily/:lat,:lon', function(req, res){
  $http.get(baseUrl + apiKey + '/' + req.params.lat + ',' + req.params.lon)
       .then(function(response){
        var overSummary = response.data.daily.summary;
        var overIcon = response.data.daily.icon;
        var dailyData = response.data.daily.data;
        var dailyArr = [];
        for(var i = 0; i < dailyData.length; i += 1){
          var o = {
            icon: dailyData[i].icon,
            tempMax: dailyData[i].temperatureMax,
            tempMin: dailyData[i].temperatureMin,
            humidity: dailyData[i].humidity,
            precipProb: dailyData[i].precipProbability
          };
          dailyArr.push(o);
        }

        var resObj = {
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          summary: overSummary,
          icon: overIcon,
          daily: dailyArr
        };
        res.status(200).json(resObj);
      })
      .catch(function(error){
        res.status(500).send({
          msg: error
        });
      });


  // $http.get(baseUrl + apiKey + '/'+req.params.lat+','+req.params.lon)
  //      .then(function(response){
  //        var responseObj = {
  //          latitude: response.data.latitude,
  //          longitude: response.data.longitude,
  //          daily: response.data.daily,
  //        };
  //        res.status(200).json(responseObj);
  //      })
  //      .catch(function(error){
  //        res.status(500).send({
  //          msg: error
  //        });
  //      });
});


//listen
server.listen(port, function(){
  console.log('Now running on port', port);
});
