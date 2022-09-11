// server.js

var fs = require('fs'),
    http = require('http');
    nodeUrl = require('url');

const PARSE_QUERY_STRING = true;

http.createServer(function (req, res) {
    var urlObj = nodeUrl.parse(req.url, PARSE_QUERY_STRING);
    var pathname = urlObj.pathname;
    var requestParameters = urlObj.query;
    //var requestParameters = urlObj.query.split('=')
    if (pathname === '/503') {
        console.log('503');
        var timeout = requestParameters && requestParameters['timeout'] ? requestParameters['timeout'] : 0;

        async function wait() {
            await new Promise(resolve => setTimeout(resolve, timeout));
        }

        wait().then(function() {
            console.log('done');
            res.writeHead(503);
            res.end('503 Server error');
        });
        return;
    } else if(pathname === '/' || pathname === '') {
        fileHandler('index.html');
        return;
    } 

    fileHandler(pathname);
    function fileHandler(pathname) {
        fs.readFile(__dirname + '/public/' + pathname, function (err, data) {
            if (err) {
                if(err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('404 Not Found');
                    return;
                } else {
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                }
            }
            res.writeHead(200);
            res.end(data);
        });
    };
}).listen(8091);