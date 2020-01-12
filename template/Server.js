const StaticServer = require("static-server");

const server = new StaticServer({
    rootPath: './dist/',
    port: 3000 
});

server.start(function(){
    console.log('Live server started at port ' + server.port);
});