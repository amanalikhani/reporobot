var request = require('request')

// With username parsed from request, check that the user has submitted a
// PR to jlord/Patchwork.
// Because PRs are merged so fast by @RR, we loop through each of the closed
// issues to find the user's PR.
// called by: checkPR(username, function(err, pr){ prStatus(res, err, pr) })
// callback includes a function which sends the pr boolean on as a response

module.exports = function (username, callback) {
  var options = {
    url: 'https://api.github.com/repos/jlord/patchwork/issues?state=closed',
    json: true,
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + process.env['REPOROBOT_TOKEN']
    }
  }

  request(options, getIssues)

  function getIssues (error, response, body) {
    if (error) return callback(error, null)
    var issues = body
    var pr = false

    for (var i = 0; i < issues.length; i++) {
      var issue = issues[i]
      var user = issue.user.login.toLowerCase()
      // what is the max number of issues that it returns?
      if (!issue.pull_request) return callback(null, pr)
      if (user.match(username.toLowerCase())) {
        pr = true
        return callback(null, pr)
      }
    }
  }
}
