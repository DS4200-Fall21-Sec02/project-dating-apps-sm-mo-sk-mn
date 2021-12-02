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
d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vRKwzteCb-m58OMLtu4EGBVm7g0uYB5D377RCNIfjPKRNtC6o84EbQhif1zyi0uyGA-1FjytCdsbBP6/pub?gid=1069853049&single=true&output=csv").then(function(data) {

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
    .style("text-anchor", "middle")
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
      console.log(bars.select('g'))
    } else if (0<mean<3){
      console.log(bars.select('g'))
    } else if (3<mean<8){
      console.log(bars.select('g'))
    } else if (8<mean<15){
      console.log(bars.select('g'))
    }else{
      console.log(bars.select('g'))
    }
    

})
}
