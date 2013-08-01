function oAuth1(oauth_consumer_key, cons_secret, oauth_token, token_secret){
  var r = require('request'), Hashes = require('jshashes'), eu = encodeURIComponent, fmt = require('util').format;
	return {
        calcHeaders: function(method, url, data){
            var sigbase = [method, url].map(function(s){ return eu(s) }).join('&') + '&', p = [];
            var h = {
                oauth_consumer_key: oauth_consumer_key,
                oauth_nonce: '902980e9ec80aae0d1b6be0814b230a6',
                oauth_signature_method: 'HMAC-SHA1',
                oauth_timestamp: 1375399058 || new Date().getTime(),
                oauth_token: oauth_token,
                oauth_version: '1.0'
            }
            for(i in h) p.push(eu(i + '=' + h[i])); sigbase += p.join(eu('&')) + (data ? eu('&' + data):'');
            h.oauth_signature = eu(new Hashes.SHA1().b64_hmac(cons_secret + '&' + token_secret, sigbase));
            h.Authorization = 'Authorization: OAuth oauth_consumer_key="'+oauth_consumer_key+'"'
            return h;
        },
		api: function(method, url, data){
            r[method]({url: url, headers: this.calcHeaders(method, url, data), form: data}, function(e,r,b){ console.log(e,r,b) });
		},
    asCurl: function(method, url, data){
            var h = util.inspect(this.calcHeaders(method, url, data)),
                hdrs = h.match(/{(.*?)}/)[1];
            return fmt("curl --get '%s' --data '%s' --header '%s' --verbose", url, data, hdrs);
    }
	}
}

var tw = oAuth1('', '', '', '');
var x = tw.asCurl('GET', 'https://api.twitter.com/1/statuses/home_timeline.json', 'q=1');
console.log(x);
