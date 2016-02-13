var express = require('express'); 
var spawn = require('child_process').spawn; 

module.exports = function (config) {
    return express.Router().put('/deployments/:repo', deploymentHandler)
        .get('/deployments/:repo', deploymentHandler);

    function deploymentHandler(request, response) {
        (!config || !config[request.params.repo]) && response.end(404);   
        
        console.log(__dirname); 
        console.log('Detected update for respository \'', request.params.repo, '\'')
        var cmd = spawn(__dirname + '/deploy.sh', [ request.params.repo ]); 
        cmd.stdout.on('data', function (data) {
            console.log(data); 
        })
        cmd.stderr.on('data', function (data) {
            console.log(data); 
        })
        response.send(''); 
    }
}; 

