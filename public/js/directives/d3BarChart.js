directives.directive("barChart", function() {
  return {
    // Restrict to an element only
    restrict: "E",
    // Data will be given in an attribute called "chart-data"
    scope: {data: "=chartData"},
    link: function(scope, element, attrs) {
      /*
       * SVG code pieced together from:
       * http://bost.ocks.org/mike/bar/3/
       * http://odiseo.net/angularjs/proper-use-of-d3-js-with-angular-directives
       * http://www.sitepoint.com/creating-charting-directives-using-angularjs-d3-js/
       */

      // Show loading indicator
      showLoading();

      // Define data to plot
      var plotData = scope.data;

      // Set margins and size of chart
      var margin = {top: 20, right: 20, bottom: 130, left: 60},
          width = 500 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

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
          .orient("left")
          .tickFormat(d3.format("d"));

      // Define tag where chart is placed (this draws a white box)
      var chart;

      /*
       * Watch for chart data changes
       */
      scope.$watchCollection("data", function(newVal, oldVal, scope) {
        // If there is new data, draw chart
        if (newVal !== oldVal) {
          // If first load
          if (oldVal === undefined) {
            // Hide loading indicator
            hideLoading();

            // Initialize chart area
            chart = d3.select(element[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", "chart")
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          }

          // Use new data for plotting
          plotData = newVal;

          // Draw chart
          redrawChart();
        }
      });

      /*
       * Shows chart loading spinner
       */
      function showLoading() {
        element.append("<i class=\"fa fa-2x fa-spinner fa-spin chart-load-icon\"></i>");
      }

      /*
       * Hides chart loading spinner
       */
      function hideLoading() {
          $("i.chart-load-icon").remove();
      }

      /*
       * Clears any existing chart elements from the SVG, then draws chart
       */
      function redrawChart() {
        // Delete existing axes and bars
        chart.selectAll("text").remove();
        chart.selectAll("g").remove();
        chart.selectAll("rect").remove();

        // Draw chart
        drawChart();
      }

      /*
       * Draws chart in SVG, expects empty canvas
       */
      function drawChart() {
        // Define domains
        x.domain(plotData.map(function(d) { return d.name; }));
        y.domain([0, d3.max(plotData, function(d) { return d.value; })]);
        var y_max = y.domain().slice(-1)[0];

        // Draw and style x axis
        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
          .selectAll("text")
            .attr("transform", "translate(-12, 5) rotate(-65)")
            .style("text-anchor", "end");

        // Draw and style y axis and number of ticks
        chart.append("g")
            .attr("class", "y axis")
            .call(yAxis.tickValues(d3.range(y_max+1)))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -45)
            .attr("x", -44)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("# of posts");

        // Draw and style bars
        chart.selectAll(".bar")
            .data(plotData)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.name); })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .attr("width", x.rangeBand());
      }
    }
  };
});
