// OAuth 2.0 Client Credentials Grant - aka Twitter Application-Only Auth
//   http://tools.ietf.org/html/rfc6749#section-4.4
//   https://dev.twitter.com/docs/auth/application-only-auth

function T(cons_key, cons_secret, token_url, svc_url){
    // default to Twitter
    token_url = token_url || 'https://api.twitter.com/oauth2/token/';
    svc_url = svc_url || 'https://api.twitter.com/1.1/';

    var r = require('request');
    // console.log('Basic ' + new Buffer(cons_key +':'+ cons_secret).toString('base64'));
    return {
        tok: null,
        api: function(name, cb){
            var th = this;
            if(!this.tok){
                r.post({url: token_url,
                    headers: {Authorization: 'Basic ' + new Buffer(cons_key +':'+ cons_secret).toString('base64')},
                    form: {grant_type: 'client_credentials'}
                }, function(e,r,b){th.tok=JSON.parse(b).access_token; th.api(name, cb)});
                return;
            }
            r.get({
                url: svc_url + name,
                headers: {Authorization: 'Bearer ' + th.tok}
            }, function(e,r,b){cb(JSON.parse(b))})
        }
    }
}
var tw = T('key', 'sec');
tw.api('lists/statuses.json?...', function(r){
    console.log(r)
});
