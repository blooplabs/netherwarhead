// Service for analyzing data from the server
// Requires app.js to be imported first

services.factory("dataAnalyzer", function() {
  var extractComments = function(scope, data) {
    console.log(data);

    // Add up the number of comments for each reddit post
    var totalComments = 0;
    for (i = 0; i < data.data.children.length; i++) {
      totalComments += data.data.children[i].data.num_comments;
      console.log(i + ":" + data.data.children[i].data.num_comments);
    }

    // Save total in a scope variable
    console.log("Total comments: " + totalComments);
    scope.num_comments = totalComments;
  };

  return {
    // Extracts data from the given JSON object
    extractData: function(scope, data) {
      return extractComments(scope, data);
    }
  };
});
