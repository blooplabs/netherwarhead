directives.directive("barChart", function() {
  return {
    // Restrict to an element only
    restrict: "E",
    // Data will be given in an attribute called "chart-data"
    scope: {data: "=chartData"},
    link: function(scope, element, attrs) {

      /*
        SVG code pieced together from:
        http://bost.ocks.org/mike/bar/3/
        http://odiseo.net/angularjs/proper-use-of-d3-js-with-angular-directives
      */

      // Set margins around chart
      var margin = {top: 20, right: 30, bottom: 30, left: 40},
          width = 480 - margin.left - margin.right,
          height = 250 - margin.top - margin.bottom;

      // Define scales for axes
      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], 0.1);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      // Define domains (can be made into a callback from here, if necessary)
      x.domain(scope.data.map(function(d) { return d.name; }));
      y.domain([0, d3.max(scope.data, function(d) { return d.value; })]);

      // Create SVG
      var chart = d3.select(element[0]).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .attr("class", "chart")
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Design and style chart axes
      chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      chart.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Frequency");

      // Design and style bars
      chart.selectAll(".bar")
          .data(scope.data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.name); })
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); })
          .attr("width", x.rangeBand());
    }
  };
});
