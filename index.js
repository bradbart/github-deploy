var exec = require('child_process').exec; 
var gitHubWebHookHandler = require('github-webhook-handler'); 

module.exports = function (config) {
    var webhook = gitHubWebHookHandler({path: config.path, secret: config.secret}); 
    webhook.on('push', function (event) {
        deployRepositoryUpdate(config, event); 
    }); 
    return function (request, response) {
        webhook(request, response, function (error) {
            response.statusCode = 404
            response.end('no such location'); 
        }); 
    }
};

function deployRepositoryUpdate(config, event) {
    var repo = event.payload.repository.name; 
    var branch = event.payload.ref.replace('refs/heads/', ''); 

    if(config.repository !== repo || config.branch !== branch) return; 
    
    var cmd = "git pull && npm install && npm test"; 
    cmd += config.deploymentCommand ? " && " + config.deploymentCommand : ""; 
    exec(cmd, { cwd: config.deploymentDirectory }, function (error, stdout, stderr) {
        if(error) {
            console.log(stdout); 
            console.log(stderr); 
            exec("git reset --hard HEAD@{1}")
        } else {
            console.log('Deployment success for ', repo, '/', branch); 
        }
    }); 
}