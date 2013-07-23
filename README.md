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
OR
````
function T(cons_key, cons_secret){
	return {
		r: require('request'),
		tok: null,
		api: function(name, cb){
			var th = this;
			if(!this.tok){
				this.r.post({url: 'https://api.twitter.com/oauth2/token/', 
				headers: {Authorization: 'Basic ' + new Buffer(cons_key +':'+ cons_secret).toString('base64')},
				form: {grant_type: 'client_credentials'}
   				}, function(e,r,b){th.tok=JSON.parse(b).access_token; th.api(name, cb)});
   				return;
    		}
			this.r.get({
				url: 'https://api.twitter.com/1.1/search/tweets.json?q=javascript',
				headers: {Authorization: 'Bearer ' + th.tok}
			}, function(e,r,b){cb(JSON.parse(b))})
		}
	}
}

var tw = T('consumer_key', 'consumer_secret');
tw.api('search/tweets.json?q=javascript', function(r){
	console.log(r)
});
````
