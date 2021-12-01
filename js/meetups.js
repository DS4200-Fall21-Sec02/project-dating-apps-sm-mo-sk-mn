// set the dimensions and margins of the graph
const m = {top: 10, right: 30, bottom: 20, left: 50},
    wi = 460 - m.left - m.right,
    he = 400 - m.top - m.bottom;

    console.log("Hello world")

// append the svg object to the body of the page
var svg4 = d3.select("#vis-holder-1")
  .append("svg")
    .attr("width", wi + m.left + m.right)
    .attr("height", he + m.top + m.bottom)
  .append("g")
    .attr("transform", "translate(" + m.left + "," + m.top + ")");

// Parse the Data
d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vRKwzteCb-m58OMLtu4EGBVm7g0uYB5D377RCNIfjPKRNtC6o84EbQhif1zyi0uyGA-1FjytCdsbBP6/pub?gid=1069853049&single=true&output=csv").then( function(data) {

  // List of subgroups = header of the csv files = soil condition here
  const subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
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

  // Show the bars
  svg4.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
        .attr("x", d => x(d.data.Meetups))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())
})
