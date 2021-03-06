/*
 * D3 Bar Chart Directive
 * Use to show a bar chart of compositional data from reddit posts
 * Requires app.js to be imported first
 */
directives.directive("barChart", function() {
  return {
    // Restrict to an element only
    restrict: "E",
    // Data will be given in an attribute called "chart-data"
    scope: {
      data: "=chartData",
      type: "=dataType"
    },
    link: function(scope, element, attrs) {
      /*
       * SVG code pieced together from:
       * http://bost.ocks.org/mike/bar/3/
       * http://odiseo.net/angularjs/proper-use-of-d3-js-with-angular-directives
       * http://www.sitepoint.com/creating-charting-directives-using-angularjs-
          d3-js/
       */

      // Show loading indicator
      showLoading();

      // Define chart information
      var chartInfo = {
        posts: {
          label: "# of posts",
          format: "d"
        },
        score: {
          label: "score",
          format: "s"
        },
        gilded: {
          label: "# of times gilded",
          format: "d"
        }
      };

      // Define data to plot
      var plotData = scope.data;

      // Define chart var
      var chart;

      // Set margins and size of chart
      var margin = {top: 20, right: 20, bottom: 170, left: 70},
          width = 510 - margin.left - margin.right,
          height = 350 - margin.top - margin.bottom;

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
          .tickFormat(d3.format(chartInfo[attrs.type].format));

      // Define y-axis label to use
      var yLabel = chartInfo[attrs.type].label;

      // Define tooltips
      var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<strong>" + yLabel + ":</strong> " +
                   "<span class='hover-tip'>" + d.value + "</span>";
          });


      /*
       * Watch for chart data changes
       */
      scope.$watchCollection("data", function(newVal, oldVal, scope) {
        // If new data is loading, show loading indicators
        if (newVal === null && oldVal !== null) {
          // Remove existing charts
          element.children().remove();
          showLoading();

        // Else data has loaded
        } else {
          // If there is new data, draw chart
          if (newVal !== oldVal) {
            // Hide loading indicator
            hideLoading();

            // Initialize chart area
            chart = d3.select(element[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", "chart")
              .append("g")
                .attr("transform", "translate(" + margin.left + "," +
                  margin.top + ")");

            chart.call(tip);

            // Use new data for plotting
            plotData = newVal;

            // Draw chart
            drawChart();
          }
        }
      });

      /*
       * Shows chart loading spinner
       */
      function showLoading() {
        element.append("<i class=\"fa fa-2x fa-spinner fa-spin " +
          "chart-load-icon\"></i>");
      }

      /*
       * Hides chart loading spinner
       */
      function hideLoading() {
          $("i.chart-load-icon").remove();
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
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -55)
            .attr("x", -44)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(yLabel);

        // Draw and style bars
        chart.selectAll(".bar")
            .data(plotData)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.name); })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .attr("width", x.rangeBand())
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
      }
    }
  };
});
