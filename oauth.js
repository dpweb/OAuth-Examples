function OAuth1(config){
	var r = require('request'), Hashes = require('jshashes'), eu = encodeURIComponent, util = require('util');
	return {
        calcHeaders: function(method, url, data){
            var sigbase = [method, url].map(function(s){ return eu(s) }).join('&') + '&', p = [];
            var h = {
                oauth_consumer_key: config.oauth_consumer_key,
                oauth_nonce: Math.random().toString(36).substring(2, 15),
                oauth_signature_method: "HMAC-SHA1",
                oauth_timestamp: Math.floor(new Date()/1000),
                oauth_token: config.oauth_token,
                oauth_version: '1.0'
            }
            for(i in h) p.push(eu(i + '=' + h[i])); sigbase += p.join(eu('&')) + (data ? eu('&' + data):'');
            h.oauth_signature = eu(new Hashes.SHA1().b64_hmac(config.consumer_secret + '&' + config.token_secret, sigbase));
            h['Authorization: OAuth oauth_consumer_key'] = config.oauth_consumer_key; delete h.oauth_consumer_key;
            var sorted = {}; Object.keys(h).sort().forEach(function(k) {sorted[k]=h[k]}); // sort object keys
            return sorted;
        },
		api: function(method, url, data, cb){
            var h = this.calcHeaders(method, url, data), hdrstr = [];
            for(i in h) hdrstr.push(util.format('%s="%s"', i, h[i]));
            hdrstr = hdrstr.join(', ').replace(/Authorization\: /,'');
            console.log(hdrstr);
            r({url: url + '?' + data, headers: {"Authorization": hdrstr}}, function(e, r, b){ cb(JSON.parse(b)) });
		},
        asCurl: function(method, url, data){
            var h = this.calcHeaders(method, url, data), ast = [];
            for(i in h) ast.push(util.format('%s="%s"', i, h[i]));
            return util.format("curl --get '%s' --data '%s' --header '%s' --verbose", url, data, ast.join(', '));
        }
	}
}

// OAuth 2.0 Client Credentials Grant - aka Twitter Application-Only Auth
//   http://tools.ietf.org/html/rfc6749#section-4.4
//   https://dev.twitter.com/docs/auth/application-only-auth

function OAuth2(config){
    var r = require('request');
    return {
        tok: null,
        api: function(name, cb){
            var th = this;
            if(!this.tok){
                r.post({url: this.token_url,
                    headers: {Authorization: 'Basic ' + new Buffer(config.oauth_consumer_key +':'+ config.consumer_secret).toString('base64')},
                    form: {grant_type: 'client_credentials'}
                }, function(e,r,b){console.log(b); th.tok=JSON.parse(b).access_token; th.api(name, cb)});
                return;
            }
            r.get({
                url: name,
                headers: {Authorization: 'Bearer ' + th.tok}
            }, function(e,r,b){cb(JSON.parse(b))})
        },
        token_url: ''
    }
}

module.exports = {
    OAuth1: OAuth1,
    OAuth2: OAuth2
}