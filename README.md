# NodeJS Github deployment

NodeJS web hook to trigger deployment when GitHub fires a web hook event. The web hook updates the local repository to the latest commit and runs a specified command to restart the service. 

## Installation
```
npm install bradbart/github-deploy
```

## Usage

Initialize a web server and run each request through the middleware. 

```javascript
var http = require('http'); 
var gitHubDeploy= require('github-deploy')({
    path: '/deployments', 
    secret: '<secret-key>', 
    repository: '<repository-name>', 
    branch: 'master', 
    deploymentDirectory : '<path-to-service-directory>', 
    deploymentCommand: '<service-restart-command>'
}); 

http.createServer(function (req, res) {
  gitHubDeploy(req, res); 
}).listen(3000); 
```

Hitting the web endpoint will fire a git pull in specified deployment directory, run 'npm test' to validate the new changes, and then restart the service using the specified deployment command.

## Options

* path: URL path to listen to. In the Above example, the middleware will run when calls are made to /deployments.  
* secret: Secret value configured in the GitHub Web Hook settings of the repository. 
* repository: Name of the repository to check for updates on 
* branch: Name of the branch to check for updates on. 
* deploymentPath: The directory in which the local repository for the service resides, ex. /var/app/<respository>
* deploymentCommand: The command to execute to restart the target service, ex. forever restart <service>