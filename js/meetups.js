// set the dimensions and margins of the graph
const m = {top: 10, right: 30, bottom: 20, left: 50},
    wi = 460 - m.left - m.right+100,
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
var tooltip2 = d3.select('#my_dataviz')                               
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
        .attr('id',function(d){
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
          .style("top", (event.y + 850) +"px");
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

// Linking function
function updateChart1(age,reason){
  console.log()
  d3.csv("data/online_dating.csv",type).then(function(data2) {
    var meets = d3.rollup(data2, v => d3.sum(v, d => d.Meetups), d => d.Reason, d => d.Age_Range);
    var lens = d3.rollup(data2, v => v.length, d => d.Reason, d => d.Age_Range);
    var mean = meets.get(reason).get(age)/lens.get(reason).get(age)
    console.log(mean)
    // We highlight the mean value of the corresponding age range + reason group
    var result = 0;
    if (mean==0){
      var result = 0;
      bars.select('#cero').style('fill','black')
    } else if (0<mean && mean<=3){
      var result = 3;
      bars.select('#one').style('fill','black')
      console.log(bars.select('#one'))
      console.log(bars)
    } else if (3<mean && mean<=8){
      var result = 8;
      bars.select('#four').style('fill','black')
    } else if (8<mean && mean<=15){
      var result = 15;
      bars.select('#ten').style('fill','black')
    }else{
      var result = 20;
      bars.select('#twenty').style('fill','black')
    }
    console.log(result)
    

})
}
