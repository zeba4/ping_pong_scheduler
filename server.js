var express = require('express')
var app = express()
 
app.get('/', function (req, res) {
  res.send(path.join('append /index.html to the url and hit enter'))
})
 
app.use(express.static(__dirname))

app.listen(8080)

console.log('listening on port numner 8080')


/*CI/CD set-up
https://confluence.cdk.com/display/ALM/Cloud+Platform%3A+How+to+configure+a+Bamboo+Build+Plan+to+build+a+Docker+Image
https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
https://confluence.cdk.com/pages/viewpage.action?pageId=127228461
*/