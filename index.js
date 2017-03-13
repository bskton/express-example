var cluster = require('cluster');

if (cluster.isMaster) {
    var cpuCount = require('os').cpus().length;

    for (var i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker) {
        console.log('Worker %d died _+_', worker.id);
        cluster.fork();
    });

    console.log('Express starting; press Ctrl-C to terminate.');
} else {
    var app = require('express')();

    app.set('port', process.env.PORT || 3000);

    app.get('/', function(req, res){
        res.type('text/plain');
        res.send('Hello Express! This is Worker ' + cluster.worker.id);
    });

    app.listen(app.get('port'), function(){
        console.log('Worker %d started', cluster.worker.id);
    });
}