services.factory("dataAnalyzer", function() {
  var extractComments = function(scope, data) {
    console.log(data);

    var totalComments = 0;
    for (i = 0; i < data.data.children.length; i++) {
      totalComments += data.data.children[i].data.num_comments;
      console.log(i + ":" + data.data.children[i].data.num_comments);
    }
    console.log("Total comments: " + totalComments);
    scope.num_comments = totalComments;
  };

  return {
    extractData: function(scope, data) {
      return extractComments(scope, data);
    }
  };
});
