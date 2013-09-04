/* create config.json like so..

{

	"oauth_consumer_key": "...", 
	"consumer_secret": "...", 
	"oauth_token": "...", 
	"token_secret": "..."

}

*/

var OAuth = require('./oauth.js');

function callback(){ 
	console.log(arguments) 
}

// get keys
var config = require('./config.json');

// OAuth 1
//var oa1_client = OAuth.OAuth1(config);
//oa1_client.api('GET', 'https://api.twitter.com/1.1/search/tweets.json', 'q=javascript', callback);

// get CURL command with headers/params for testing -- pipe output to sh
//console.log( oa1_client.asCurl('GET', 'https://api.twitter.com/1.1/search/tweets.json', 'q=javascript') );

// OAuth 2
var oa2_client = OAuth.OAuth2(config);
oa2_client.token_url = 'https://api.twitter.com/oauth2/token/';
oa2_client.api('https://api.twitter.com/1.1/lists/statuses.json?slug=testlist&owner_screen_name=@digplan', callback);

