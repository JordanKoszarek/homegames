const http = require("http");
const fs = require('fs');

http.createServer((req, res) => {
    const path = req.url;
    let contentType, payload;

    switch(path) {
        case '/': {
            const index = fs.readFileSync('unity/index.html');
            contentType = 'text/html';
            payload = index;
            break;
        }
        case '/app.js': {
            const app = fs.readFileSync('web/app.js');
            contentType = 'text/javascript';
            payload = app;
            break;
        }
        case '/app.css': {
            const style = fs.readFileSync('web/app.css');
            contentType = 'text/css';
            payload = style;
            break;
        }
        case '/TemplateData/UnityProgress.js':
        {
            const progress = fs.readFileSync('unity/TemplateData/UnityProgress.js');
            contentType = 'text/javascript';
            payload = progress;
            break;
        }
        case '/Build/WebBuild.loader.js':
        {
            const loader = fs.readFileSync('unity/Build/WebBuild.loader.js');
            contentType = 'text/javascript';
            payload = loader;
            break;
        }
        case '/Build/WebBuild.json':
        {
            const loader = fs.readFileSync('unity/Build/WebBuild.json');
            contentType = 'text/javascript';
            payload = loader;
            break;
        }
        case '/Build/WebBuild.data.gz':
        {
            const loader = fs.readFileSync('unity/Build/WebBuild.data.gz');
            contentType = 'application/javascript';
            res.setHeader('Content-Encoding', 'gzip');
            payload = loader;
            break;
        }
        case '/Build/WebBuild.framework.js.gz':
        {
            const loader = fs.readFileSync('unity/Build/WebBuild.framework.js.gz');
            contentType = 'application/javascript';
            res.setHeader('Content-Encoding', 'gzip');
            payload = loader;
            break;
        }
        case '/Build/WebBuild.wasm.gz':
        {
            const loader = fs.readFileSync('unity/Build/WebBuild.wasm.gz');
            contentType = 'application/wasm';
            res.setHeader('Content-Encoding', 'gzip');
            payload = loader;
            break;
        }
        default: {
            res.statusCode = 404;
            res.end();
            return;
        }
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.end(payload);
}).listen(process.env.PORT || 2001);
