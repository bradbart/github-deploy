var express = require('express'); 
var spawn = require('child_process').spawn; 

module.exports = function (config) {
    return express.Router().post('/deployments/:repo', deploymentHandler)
        .get('/deployments/:repo', deploymentHandler);

    function deploymentHandler(request, response) {
        if(!config || !config[request.params.repo]) {
            response.status(404).send('Not found'); 
            return; 
        }
        console.log('Detected update for respository \'', request.params.repo, '\'')
        var cmd = spawn(__dirname + '/deploy.sh', [ request.params.repo ]);
        cmd.stdout.on('data', function (data) {
            console.log(data.toString()); 
        }) 
        cmd.stderr.on('data', function (data) {
            console.log(data.toString()); 
        }) 
        response.send(''); 
    }
}; 

