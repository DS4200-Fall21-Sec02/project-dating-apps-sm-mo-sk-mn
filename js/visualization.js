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
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 3.7 + "," + height / 2.1 + ")");

  d3.csv("data/draft.csv",type).then((data_pie, error) => {
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
    
    d3.selectAll('input[name="reason"]')
    .on('change',function(){
      var data_filtered = dict.filter(d => (d.Reason == this.value))
      change(data_filtered)
    })

    var tooltip = d3.select('#vis1')
		.append('div')
    .attr('background','red')
    .attr('width','100px')
    .attr('height','100px')
		.attr('class', 'tooltip');

		tooltip.append('div')
		.attr('class', 'label1');

    tooltip.append('div')
		.attr('class', 'label2');

		tooltip.append('div')
		.attr('class', 'count');

		tooltip.append('div')
		.attr('class', 'percent');

    function change(Age_Range) {
          var path = svg.selectAll("path");
          var data0 = path.data(),
          data1 = pie(Age_Range);
    
          path = path.data(data1, key);

          path.on('mouseover', function(event,d) {
            tooltip.select('.label1').html(d.data.Age_Range.toUpperCase()).style('color','black');
            tooltip.select('.count').html(d.data.Count);
            tooltip.select('.label2').html(d.data.Reason.toUpperCase()).style('color','black');
            tooltip.style('opacity',2);
      
          });
      
          path.on('mousemove', function(event,d) {
            tooltip.style("left", (event.x)+"px") 
            .style("top", (event.y + 20) +"px");
            console.log('hello')

          });
      
          path.on('mouseout', function() {
            tooltip.style('opacity',0);
          });
    
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
    .attr('id','svg1')
  .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);

// append the svg object to the div
var svg2 = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr('id','svg2')
.append("g")
  .attr("transform", `translate(${width/2}, ${height/2})`);

// Set colors

var color1 = d3.scaleOrdinal()
  //.domain(Object.keys(data))
  .range(["#FCECDD", "#FFC288", "#FEA82F", "#FF6701", "#FF8303", "#A35709", "#864000"])

// Create pie
var pie = d3.pie()
  .value(function(d) {return d.Count})

var tooltip = d3.select('#my_dataviz')                               
  .append('div')                                                
  .attr('class', 'tooltip');                                    
              
tooltip.append('div')                                           
  .attr('class', 'label');                                      
     
tooltip.append('div')                                           
  .attr('class', 'count');                                      


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
  .on('mouseover',function(event,d){
    d3.select(this).select('path').attr('d',zoom)
  })

  var zoom = d3.arc().innerRadius(0).outerRadius(180);


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

  var mySvg = d3.select('#my_dataviz')
  .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr('id','legend');

  


  var legendG = mySvg.selectAll(".legend") // note appending it to mySvg and not svg to make positioning easier
  .data(pie(data))
  .enter().append("g")
  .attr("transform", function(d, i) {
     return "translate(" + (width - 350) + "," + (i * 15 + 20) + ")"; // place each legend on the right and bump each one down 15 pixels
  })
  .attr("class", "legend");

legendG.append("rect") // make a matching color rect
  .attr("width", 10)
  .attr("height", 10)
  .attr('x',8)
  .attr('y',8)
  .attr("fill", function(d, i) {
     return color1(d.data.Categories);
  });

legendG.append("text") // add the text
  .text(function(d) {
     return d.data.Categories;
  })
  .style("font-size", 12)
  .attr("y", 17)
  .attr("x", 22);

})