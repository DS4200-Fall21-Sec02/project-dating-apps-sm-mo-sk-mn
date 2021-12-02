// Vis 1 --> Reason + age ranges

// Parameters for interaction animation
var myDuration = 600;
var firstTime = true;

// Pie parameters + selected color scheme
var width = 960,
height = 500,
radius = Math.min(width, height) / 2;
var color = d3.scaleOrdinal(['#EBB9DF','#60992D','#D991BA','#8CAE68']);

// Pie variable function with data counts
var pie = d3.pie()
.value(function(d) { return d.Count; })
.sort(null);

// Pie arcs variable
var arc = d3.arc()
.innerRadius(radius - 100)
.outerRadius(radius - 20);

// Select where we want to place our vis and create svg space
var svg = d3.select("#vis-svg-1")
.attr("width", width-400)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 3.7 + "," + height / 2.1 + ")");

// Read the data and group according to Reason and Age_Range, then count observations in these groups and create dataframe
  d3.csv("data/online_dating.csv",type).then((data_pie, error) => {
    var reasonByAge = d3.rollup(data_pie, v => v.length, d => d.Reason, d => d.Age_Range);
    var dict = [{Age_Range: '18-19', Reason: 'Entertainment', Count: reasonByAge.get('Entertainment').get('18-19')},
                {Age_Range: '20-21', Reason: 'Entertainment', Count: reasonByAge.get('Entertainment').get('20-21')},
                {Age_Range: '22-23', Reason: 'Entertainment', Count: reasonByAge.get('Entertainment').get('22-23')},
                {Age_Range: '24-26', Reason: 'Entertainment', Count: reasonByAge.get('Entertainment').get('24-26')},
                {Age_Range: '18-19', Reason: 'For a relationship', Count: reasonByAge.get('For a relationship').get('18-19')},
                {Age_Range: '20-21', Reason: 'For a relationship', Count: reasonByAge.get('For a relationship').get('20-21')},
                {Age_Range: '22-23', Reason: 'For a relationship', Count: reasonByAge.get('For a relationship').get('22-23')},
                {Age_Range: '24-26', Reason: 'For a relationship', Count: reasonByAge.get('For a relationship').get('24-26')},
                {Age_Range: '18-19', Reason: 'To meet new people', Count: reasonByAge.get('To meet new people').get('18-19')},
                {Age_Range: '20-21', Reason: 'To meet new people', Count: reasonByAge.get('To meet new people').get('20-21')},
                {Age_Range: '22-23', Reason: 'To meet new people', Count: reasonByAge.get('To meet new people').get('22-23')},
                {Age_Range: '24-26', Reason: 'To meet new people', Count: reasonByAge.get('To meet new people').get('24-26')},
                {Age_Range: '18-19', Reason: 'For casual hookups', Count: reasonByAge.get('For casual hookups').get('18-19')},
                {Age_Range: '20-21', Reason: 'For casual hookups', Count: reasonByAge.get('For casual hookups').get('20-21')},
                {Age_Range: '22-23', Reason: 'For casual hookups', Count: reasonByAge.get('For casual hookups').get('22-23')},
                {Age_Range: '24-26', Reason: 'For casual hookups', Count: reasonByAge.get('For casual hookups').get('24-26')}]
    
    // Obtain input selection from user and update data accordingly
    d3.selectAll('input[name="reason"]')
    .on('change',function(){
      var data_filtered = dict.filter(d => (d.Reason == this.value))
      change(data_filtered)
    })

    // Tooltip creation
    var tooltip = d3.select('#vis1')
    .append('div')
    .style('opacity','0')
    .attr('weight','auto')
    .attr('class', 'tooltip');

    tooltip.append('div')
    .attr('class', 'label1');

    tooltip.append('div')
    .attr('class', 'label2');

    tooltip.append('div')
    .attr('class', 'count');

    // Function for the change of data
    function change(Age_Range) {
          // Obtain previous and new data to be shown
          var path = svg.selectAll("path");
          var data0 = path.data(),
          data1 = pie(Age_Range);
    
          path = path.data(data1, key);

          // On mouseover, show tooltip and transition for effect of shadow
          path.on('mouseover', function(event,d) {
            tooltip.select('.label1').html('Age Range: '+d.data.Age_Range).style('color','black');
            tooltip.select('.count').html('Count: '+ d.data.Count);
            tooltip.select('.label2').html('Reason: '+d.data.Reason).style('color','black');
            tooltip.style('opacity',1);
            d3.select(this).transition().duration(300)
              .style('filter','drop-shadow(2px 4px 7px black)')
            // Store selection for linking
            var age = d.data.Age_Range;
            var reason = d.data.Reason;
            updateChart1(age,reason);
      
          });
          
          // Move tooltip accordingly when the mouse is moved
          path.on('mousemove', function(event,d) {
            tooltip.style("left", (event.x)+"px") 
            .style("top", (event.y+700) +"px");
          });
          
          // Hide tooltip and transition when mouse is removed from slice
          path.on('mouseout', function(event,d) {
            tooltip.style('opacity',0);
            d3.select(this).transition().duration(300)
              .style('filter','none')
            var age = d.data.Age_Range;
            var reason = d.data.Reason;
            removeClass(age,reason)
          });
          
          // Transition into new data
          path
          .transition()
          .duration(myDuration)
          .attrTween("d", arcTween)

          // Arc adjusting for smooth effect
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
  
  // Helper functions to obtain data
  function key(d) {
    return d.data.Age_Range;
  }

  function type(d) {
    d.Count = +d.Count;
    return d;
  }

  // Helper functions to find the best way to arrange the information
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

// Vis 3 --> Vices
// Set the dimensions and margins of the graph
var width = 450,
    height = 450,
    margin = 40;
var radius = Math.min(width, height) / 2 - margin;

// Append the svg object to the div for pie 1
var svg1 = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr('id','svg1')
  .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);

// Append the svg object to the div for pie 2
var svg2 = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr('id','svg2')
.append("g")
  .attr("transform", `translate(${width/2}, ${height/2})`);

// Set color scheme
var color1 = d3.scaleOrdinal()
  .range(["#FCECDD", "#FFC288", "#FEA82F", "#FF6701", "#FF8303", "#A35709", "#4E3620"])

// Create pie
var pie = d3.pie()
  .value(function(d) {return d.Count})

// Create tooltip
var tooltip1 = d3.select('#my_dataviz')                               
  .append('div')    
  .style('opacity','0')                                            
  .attr('class', 'tooltip');                                    
              
tooltip1.append('div')                                           
  .attr('class', 'label1');                                      
     
tooltip1.append('div')                                           
  .attr('class', 'count');                                      


// Read data
d3.csv('data/Turn-Ons.csv').then(function(data){
  
// Build the pie chart where each part of the pie is a path that we build using the arc function.
svg1
  .selectAll('path')
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
  // Same affects as in the first pie chart
  .on('mouseover',function(event,d){
    tooltip1.select('.label1').html('Attribute: '+d.data.Categories).style('color','black');
    tooltip1.select('.count').html('Count: '+d.data.Count);
    tooltip1.style('opacity',1);
    d3.select(this).transition().duration(300).style('filter','drop-shadow(2px 4px 7px black)')
  })
  .on('mousemove', function(event,d) {
    tooltip1.style("left", (event.x)+"px") 
    .style("top", (event.y + 1200) +"px");

  })
  .on('mouseout', function() {
    tooltip1.style('opacity',0);
    d3.select(this).transition().duration(300).style('filter','none')
  });


})

// Same procedure as the turn-ons data
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
  .on('mouseover',function(event,d){
    tooltip1.select('.label1').html('Attribute: '+d.data.Categories).style('color','black');
    tooltip1.select('.count').html('Count: '+d.data.Count);
    tooltip1.style('opacity',1);
    d3.select(this).transition().duration(300).style('filter','drop-shadow(2px 4px 7px black)')
  })
  .on('mousemove', function(event,d) {
    tooltip1.style("left", (event.x)+"px") 
    .style("top", (event.y + 1200) +"px");

  })
  .on('mouseout', function() {
    tooltip1.style('opacity',0);
    d3.select(this).transition().duration(300).style('filter','none')
  });

  var mySvg = d3.select('#my_dataviz')
  .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr('id','legend');


  // Create a separate element for the legend and pass data
  var legendG = mySvg.selectAll(".legend") 
  .data(pie(data))
  .enter().append("g")
  .attr("transform", function(d, i) {
     return "translate(" + (width - 390) + "," + (i * 24 + 10) + ")"; // place each legend on the right and bump each one down 24 pixels
  })
  .attr("class", "legend");

// Create color elements as rects and set corresponding color
legendG.append("rect") // make a matching color rect
  .attr("width", 16)
  .attr("height", 16)
  .attr('x',8)
  .attr('y',8)
  .style('stroke','black')
  .attr("fill", function(d, i) {
     return color1(d.data.Categories);
  });

// Create text elements and set corresponding attribute name
legendG.append("text") // add the text
  .text(function(d) {
     return d.data.Categories;
  })
  .style("font-size", 17)
  .attr("y", 22)
  .attr("x", 29);

})