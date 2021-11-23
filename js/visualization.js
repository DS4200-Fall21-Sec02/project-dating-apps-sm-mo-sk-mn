// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 




var myDuration = 600;
var firstTime = true;

var width = 960,
height = 500,
radius = Math.min(width, height) / 2;

var width = 960,
height = 500,
radius = Math.min(width, height) / 2;
var color = d3.scaleOrdinal(['#EBB9DF','#60992D','#D991BA','#8CAE68']);


var pie = d3.pie()
.value(function(d) { return d.Count; })
.sort(null);

var arc = d3.arc()
.innerRadius(radius - 100)
.outerRadius(radius - 20);

var svg = d3.select("#vis-svg-1")
.attr("width", width+440)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


  d3.tsv("data/data_total.tsv",type).then((data_pie, error) => {
    //var reasonByAge = d3.group(data, d => d.Reason);
    // var apples = regionsByFruit.get('Apples')
    // var oranges = regionsByFruit.get('Oranges')
    console.log(data_pie)
    
    d3.selectAll('input[name="reason"]')
    .on('change',function(){
      var data_filtered = data_pie.filter(d => (d.Reason == this.value))
      change(data_filtered)
    })
  

    function change(Age_Range) {
          var path = svg.selectAll("path");
          console.log('in change Age_Range')
          console.log(Age_Range)
          var data0 = path.data(),
          data1 = pie(Age_Range);
          console.log(data1)
    
          path = path.data(data1, key);
    
          path
          .transition()
          .duration(myDuration)
          .attrTween("d", arcTween)

          path
              .enter()
              .append("path")
              .each(function(d, i) {
                var narc = findNeighborArc(i, data0, data1, key) ;
                if(narc) {          
                  this._current = narc;
                  this._previous = narc;
                } else {          
                  this._current = d;
                }
              }) 
              .attr("fill", function(d,i) { 
               return color(d.data.Age_Range)
             })
              .transition()
              .duration(myDuration)
              .attrTween("d", arcTween)

              path
                  .exit()
                  .transition()
                  .duration(myDuration)
                  .attrTween("d", function(d, index) {
            
                    var currentIndex = this._previous.data.Age_Range;
                    var i = d3.interpolateObject(d,this._previous);
                    return function(t) {
                      return arc(i(t))
                    }
            
                  })
                  .remove()
            
            
                  firstTime = false;
            
              };
  }) 
  
  function key(d) {
    return d.data.Age_Range;
  }

  function type(d) {
    d.Count = +d.Count;
    return d;
  }

  function findNeighborArc(i, data0, data1, key) {
    var d;
    if(d = findPreceding(i, data0, data1, key)) {

      var obj = cloneObj(d)
      obj.startAngle = d.endAngle;
      return obj;

    } else if(d = findFollowing(i, data0, data1, key)) {

      var obj = cloneObj(d)
      obj.endAngle = d.startAngle;
      return obj;

    }

    return null


  }

// Find the element in data0 that joins the highest preceding element in data1.
function findPreceding(i, data0, data1, key) {
  var m = data0.length;
  while (--i >= 0) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

// Find the element in data0 that joins the lowest following element in data1.
function findFollowing(i, data0, data1, key) {
  var n = data1.length, m = data0.length;
  while (++i < n) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

function arcTween(d) {

  var i = d3.interpolate(this._current, d);

  this._current = i(0);

  return function(t) {
    return arc(i(t))
  }

}
function cloneObj(obj) {
  var o = {};
  for(var i in obj) {
    o[i] = obj[i];
  }
  return o;
}

// // set the dimensions and margins of the graph
// var margin = {top: 10, right: 30, bottom: 20, left: 50},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg2 = d3.select("#my_dataviz")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// // Parse the Data
// d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv", function(data) {

//   // List of subgroups = header of the csv files = soil condition here
//   var subgroups = data.columns.slice(1)

//   // List of groups = species here = value of the first column called group -> I show them on the X axis
//   var groups = d3.map(data, function(d){return(d.group)}).keys()

//   // Add X axis
//   var x = d3.scaleBand()
//       .domain(groups)
//       .range([0, width])
//       .padding([0.2])
//   svg2.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x).tickSizeOuter(0));

//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([0, 60])
//     .range([ height, 0 ]);
//   svg2.append("g")
//     .call(d3.axisLeft(y));

//   // color palette = one color per subgroup
//   var color = d3.scaleOrdinal()
//     .domain(subgroups)
//     .range(['#e41a1c','#377eb8','#4daf4a'])

//   //stack the data? --> stack per subgroup
//   var stackedData = d3.stack()
//     .keys(subgroups)
//     (data)

//   // Show the bars
//   svg2.append("g")
//     .selectAll("g")
//     // Enter in the stack data = loop key per key = group per group
//     .data(stackedData)
//     .enter().append("g")
//       .attr("fill", function(d) { return color(d.key); })
//       .selectAll("rect")
//       // enter a second time = loop subgroup per subgroup to add all rectangles
//       .data(function(d) { return d; })
//       .enter().append("rect")
//         .attr("x", function(d) { return x(d.data.group); })
//         .attr("y", function(d) { return y(d[1]); })
//         .attr("height", function(d) { return y(d[0]) - y(d[1]); })
//         .attr("width",x.bandwidth())
// })

// Vis 3
// set the dimensions and margins of the graph
var width = 450,
    height = 450,
    margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin;

// append the svg object to the div
var svg1 = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);

// append the svg object to the div
var svg2 = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width)
  .attr("height", height)
.append("g")
  .attr("transform", `translate(${width/2}, ${height/2})`);

// Set colors

var color1 = d3.scaleOrdinal()
  //.domain(Object.keys(data))
  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#b12345", "#c21434"])

// Create pie
var pie = d3.pie()
  .value(function(d) {return d.Count})

d3.csv('data/Turn-Ons.csv').then(function(data){
  
// Build the pie chart where each part of the pie is a path that we build using the arc function.
svg1
  .selectAll('whatever')
  .data(pie(data))
  .join('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
  )
  .attr('fill', function(d){ return(color1(d.data.Categories)) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)

})

d3.csv('data/Turn-Offs.csv').then(function(data){
  
// Build the pie chart where each part of the pie is a path that we build using the arc function.
svg2
  .selectAll('whatever')
  .data(pie(data))
  .join('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
  )
  .attr('fill', function(d){ return(color1(d.data.Categories)) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)

})
