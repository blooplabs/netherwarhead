var request = require('request');

var endpoint = "http://www.netherwarhead.com/api/pull";

request(endpoint, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  } else {
    console.log('Error encountered running webjob.');
  }
});
