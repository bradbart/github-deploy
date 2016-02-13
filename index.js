var express = require('express'); 
var exec = require('child_process').exec; 
var bodyParser = require('body-parser'); 

module.exports = function (config) {
    return express.Router()
        .use(bodyParser.json()) 
        .post('/deployments/:repo', deploymentsRouter); 
        
    function deploymentsRouter(req, res) {
        deploymentHandler(config, req, res); 
    }
}; 

function deploymentHandler(config, request, response) {
    var repo = request.params.repo; 
    var branch = request.body.ref && request.body.ref.replace('refs/heads/', ''); 
    
    var info = config && config[repo] && config[repo][branch]; 
    
    if(!info) {
        response.status(404).send('Not found'); 
        return; 
    }
    
    if(!info.path) {
        response.send(''); 
        return; 
    }
    
    var cmd = "git pull && npm install && npm test"; 
    cmd += info.restartCommand ? " && " + info.restartCommand : ""; 
    exec(cmd, { cwd: info.path }, function (error, stdout, stderr) {
        if(error) {
            console.log(stdout); 
            console.log(stderr); 
            response.status(500).send('Error occurred during deployment');
            return; 
        } else {
            console.log('Deployment success for ', request.params.repo, '/', request.body.ref); 
            response.send(''); 
            return;             
        }
    }); 
}