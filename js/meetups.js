// set the dimensions and margins of the graph
const m = {top: 10, right: 30, bottom: 20, left: 50},
    wi = 460 - m.left - m.right+100,
    legendh = 100,
    padding = 40,
    he = 400 - m.top - m.bottom+100;

// append the svg object to the body of the page
var svg4 = d3.select("#vis-holder-1")
.attr('id','visl2')
  .append("svg")
    .attr("width", wi + m.left + m.right)
    .attr("height", he + m.top + m.bottom)
    .style('padding-top','250px')
    .style('padding-left','100px')
  .append("g")
    .attr("transform", "translate(" + m.left + "," + m.top + ")");


// Obtain the Data
d3.csv("data/FinalMatchesPerDay.csv").then(function(data) {

// Create tooltip 
var tooltip2 = d3.select('#visl2')                               
  .append('div')    
  .style('opacity','0')                                            
  .attr('class', 'tooltip');                                    
              
tooltip2.append('div')                                           
  .attr('class', 'label1');                                      
     
tooltip2.append('div')                                           
  .attr('class', 'label2');

tooltip2.append('div')                                           
  .attr('class', 'count');

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)

  // List of groups = value of the first column called group -> I show them on the X axis
  var groups = data.map(d => (d.Meetups))

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, wi])
      .padding([0.2])
  svg4.append("g")
    .attr("transform", `translate(0, ${he})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 120])
    .range([ he, 0 ]);
  svg4.append("g")
    .call(d3.axisLeft(y));

  // Create the color scheme
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#5F939A','#D8AC'])

  // Stack the data per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)

  // Add axis titles
  svg4.append("text")
    .attr("x", 170)
    .attr("y", 5)
    .style("text-anchor", "start")
    .text("Meetups")
    .attr('id','highlight')

  // Add a legend
    var legendh = svg4.selectAll(".legend") 
    .data(stackedData)
    .enter().append("g")
    .attr("transform", function(d, i) {
       return "translate(" + (wi - 390) + "," + (i * 24 + 10) + ")"; // place each legend on the right and bump each one down 24 pixels
    })
    .attr("class", "legend");
  
   // Create color elements as rects and set corresponding color
    legendh.append("rect") // make a matching color rect
      .data(subgroups)
      .attr("width", 16)
      .attr("height", 16)
      .attr('x',326)
      .attr('y',8)
      .style('stroke','black')
      .attr("fill", function(d, i) {
         return color(d);
      });
  
    // Create text elements and set corresponding attribute name
    legendh.append("text") // add the text
      .data(subgroups)
      .text(function(d) {
         return d;
      })
      .style("font-size", 17)
      .attr("y", 22)
      .attr("x", 350);

  // Show the bars and store for linking
  bars = svg4.append("g")
    .selectAll("g")
    // Enter in the stack data and loop group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // Anter again and loop subgroup per subgroup to add all rects
      .data(d => d)
      .enter()
      .append("rect")
        .attr('class',function(d){
          var label = NaN;
          if (d.data.Meetups == '0'){
            label = 'cero'
          } else if (d.data.Meetups == '1-3'){
            label = 'one'
          } else if (d.data.Meetups == '4-8'){
            label = 'four'
          } else if (d.data.Meetups == '10-15'){
            label = 'ten'
          } else {
            label = 'twenty'
          }
          return label
        })
        .attr("x", d => x(d.data.Meetups))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())
        // COlor change on mouseover transition effect + add tooltip
        .on('mouseover',function(event,d){
          if (d[0]>0){
            var key1 = 'Female'
            var count = d[1]-d[0]
          } else {
            var key1 = 'Male'
            var count = d[1]
          }
          tooltip2.select('.label1').html('Sex: '+key1).style('color','black');
          tooltip2.select('.label2').html('Meetups: '+d.data.Meetups);
          tooltip2.select('.count').html('Count: '+count);
          tooltip2.style('opacity',1);
          d3.select(this).transition().duration(300).style('fill','#b6cf9d')
        })
        .on('mousemove', function(event,d) {
          tooltip2.style("left", (event.x)+"px") 
          .style("top", (event.y + 600) +"px");
        })
        .on('mouseout', function(event,d) {
          if (d[0]>0){
            var key1 = 'Female'
          } else {
            var key1 = 'Male'
          }
          tooltip2.style('opacity',0);
          d3.select(this).transition().duration(300).style('fill',function(d){ return(color(key1)) })
        });

    
})

// Locate our graph info
let bars

// Linking function --> add linking
function updateChart1(age,reason){
  d3.csv("data/online_dating.csv",type).then(function(data2) {
    var meets = d3.rollup(data2, v => d3.sum(v, d => d.Meetups), d => d.Reason, d => d.Age_Range);
    var lens = d3.rollup(data2, v => v.length, d => d.Reason, d => d.Age_Range);
    var mean = meets.get(reason).get(age)/lens.get(reason).get(age)
    // We highlight the mean value of the corresponding age range + reason group
    if (mean==0){
      d3.selectAll('.cero').classed('selected',1)
    } else if (0<mean && mean<=3){
      d3.selectAll('.one').classed('selected',1)
    } else if (3<mean && mean<=8){
      d3.selectAll('.four').classed('selected',1)
    } else if (8<mean && mean<=15){
      d3.selectAll('.ten').classed('selected',1)
    }else{
      d3.selectAll('.twenty').classed('selected',1)
    }
})
}
// Linking function --> remove linking
function removeClass(age,reason){
  d3.csv("data/online_dating.csv",type).then(function(data3) {
    var meets = d3.rollup(data3, v => d3.sum(v, d => d.Meetups), d => d.Reason, d => d.Age_Range);
    var lens = d3.rollup(data3, v => v.length, d => d.Reason, d => d.Age_Range);
    var mean = meets.get(reason).get(age)/lens.get(reason).get(age)
    // We remove the highlight from the mean value of the corresponding age range + reason group
    if (mean==0){
      d3.selectAll('.cero').classed('selected',0)
    } else if (0<mean && mean<=3){
      d3.selectAll('.one').classed('selected',0)
    } else if (3<mean && mean<=8){
      d3.selectAll('.four').classed('selected',0)
    } else if (8<mean && mean<=15){
      d3.selectAll('.ten').classed('selected',0)
    }else{
      d3.selectAll('.twenty').classed('selected',0)
    }
})
}


