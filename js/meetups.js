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


// Parse the Data
d3.csv("data/FinalMatchesPerDay.csv").then(function(data) {

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
  const subgroups = data.columns.slice(1)

  // List of groups = value of the first column called group -> I show them on the X axis
  const groups = data.map(d => (d.Meetups))

  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, wi])
      .padding([0.2])
  svg4.append("g")
    .attr("transform", `translate(0, ${he})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 120])
    .range([ he, 0 ]);
  svg4.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#5F939A','#D8AC'])

  //stack the data? --> stack per subgroup
  const stackedData = d3.stack()
    .keys(subgroups)
    (data)

  //add axis titles
  svg4.append("text")
    .attr("x", 170)
    .attr("y", 5)
    .style("text-anchor", "start")
    .text("Matches Per Day")

  // Show the bars
  bars = svg4.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .enter()
      .append("rect")
        .attr("x", d => x(d.data.Meetups))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())
        .on('mouseover',function(event,d){
          if (d[0]>0){
            var key1 = 'Female'
            var count = d[1]-d[0]
          } else {
            var key1 = 'Male'
            var count = d[0]
          }
          tooltip2.select('.label1').html('Sex: '+key1).style('color','black');
          tooltip2.select('.label2').html('Meetups: '+d.data.Meetups);
          tooltip2.select('.count').html('Count: '+count);
          tooltip2.style('opacity',1);
          d3.select(this).transition().duration(300).style('fill','#b8deea')
        })
        .on('mousemove', function(event,d) {
          tooltip2.style("left", (event.x)+"px") 
          .style("top", (event.y + 750) +"px");
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

let bars

function updateChart1(age,reason){
  console.log(bars.select('g'))
  d3.csv("data/draft.csv",type).then(function(data2) {
    var meets = d3.rollup(data2, v => d3.sum(v, d => d.Meetups), d => d.Reason, d => d.Age_Range);
    var lens = d3.rollup(data2, v => v.length, d => d.Reason, d => d.Age_Range);
    var mean = meets.get(reason).get(age)/lens.get(reason).get(age)
    console.log(mean)
    if (mean==0){
      console.log(0)
    } else if (0<mean<3){
      console.log(3)
    } else if (3<mean<8){
      console.log(8)
    } else if (8<mean<15){
      console.log(15)
    }else{
      console.log(20)
    }
    

})
}
