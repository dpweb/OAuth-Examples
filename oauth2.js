// OAuth 2.0 Client Credentials Grant - aka Twitter Application-Only Auth
//   http://tools.ietf.org/html/rfc6749#section-4.4
//   https://dev.twitter.com/docs/auth/application-only-auth

function T(config, token_url){
    // default to Twitter
    token_url = token_url || 'https://api.twitter.com/oauth2/token/';
    var r = require('request');
    return {
        tok: null,
        api: function(name, cb){
            var th = this;
            if(!this.tok){
                r.post({url: token_url,
                    headers: {Authorization: 'Basic ' + new Buffer(config.oauth_consumer_key +':'+ config.consumer_secret).toString('base64')},
                    form: {grant_type: 'client_credentials'}
                }, function(e,r,b){console.log(b); th.tok=JSON.parse(b).access_token; th.api(name, cb)});
                return;
            }
            r.get({
                url: name,
                headers: {Authorization: 'Bearer ' + th.tok}
            }, function(e,r,b){cb(JSON.parse(b))})
        }
    }
}

var tw = T(require('./config.json'));
tw.api('https://api.twitter.com/1.1/lists/statuses.json?slug=testlist&owner_screen_name=@digplan', function(r){
    console.log(r)
});