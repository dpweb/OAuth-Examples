####Application-Only Authentication
[Simpler than the full-blown OAuth.](https://dev.twitter.com/docs/auth/application-only-auth)

````
var cons_key = '',
  cons_secret = '';

var request = require('request');

request.post({ 
	url: 'https://api.twitter.com/oauth2/token/',
	headers: {Authorization: 'Basic ' + new Buffer(cons_key +':'+ cons_secret).toString('base64')},
	form: {grant_type: 'client_credentials'}
   },
    function (error, response, body) {
        var token = JSON.parse(body).access_token;
        search(token);
    }
);

function search(token){
	
	request.get({
		url: 'https://api.twitter.com/1.1/search/tweets.json?q=javascript',
		headers: {Authorization: 'Bearer ' + token}
	}, function(e, r, b){
		console.log(r.body);
	})
}
````
