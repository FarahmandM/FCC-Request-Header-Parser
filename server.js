/*
 * @author Farahmand Moslemi
 */

var http = require('http'),
  url = require('url');


var server = http.createServer(function(req, res) {
  if (url.parse(req.url).pathname === '/') {
    var data, ip, lang, sw;
    ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    lang = req.headers['accept-language'];
    sw = req.headers['user-agent'];
    if (ip && lang && sw) {
      var m;
      if (m = ip.match(/^((\d{1,3}\.){3}\d{1,3})/)) {
        ip = m[1];
      }
      if (m = lang.match(/(\w{2}\-\w{2})/i)) {
        lang = m[0];
      }
      if (m = sw.match(/(\([^)]*\))/i)) {
        sw = m[0].slice(1, m[0].length - 1);
      }
      data = {
        ipaddress: ip,
        language: lang,
        software: sw
      };
    } else {
      data = {
        status: 'error',
        description: 'Browsers only!'
      };
    }
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404, {'content-type': 'text/plain'});
    res.end('404 - Not Found!');
  }
});
process.env.PORT = '13000';
server.listen(parseInt(process.env.PORT));