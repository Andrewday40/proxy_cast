var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var $http = require('axios');
var server = express();


var port = process.env.PORT || 8080;
var apiKey = require('./config').apiKey;
var baseUrl = 'https://api.forecast.io/forecast/';

//plugins middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(cors());


//test routes
server.get('/forecast/hourly/:lat,:lon', function(req, res){
  $http.get(baseUrl + apiKey + '/'+req.params.lat+','+req.params.lon)
       .then(function(response){
         var resObj = {
           latitude: response.data.latitude,
           longitude: response.data.longitude,
           hourly: response.data.hourly,
         };
         res.status(200).json(resObj);
       })
       .catch(function(error){
         res.status(500).send({
           msg: error
         });
       });
});

//listen
server.listen(port, function(){
  console.log('Now running on port', port);
});
