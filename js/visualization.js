// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 

d3.csv("data/newpeople_age.csv").then((data,error) => {
  if (error) throw error;

  var margin = { top: 10, right: 30, bottom: 50, left: 60 },
  width = 300 - margin.left - margin.right,
  height = 290 - margin.top - margin.bottom;
  var radius = width / 2;
  var innerRadius = 0;

		var svg1 = d3
    .select("#area1")
    .append('svg')
    .attr('id','svg1')
		.attr("width",width + margin.left + margin.right)
		.attr("height",height + margin.top + margin.bottom);

		var color = d3.scaleOrdinal(['#EBB9DF','#8CAE68','#D991BA','#60992D']);
    var label = d3.arc().innerRadius(2 * radius / 4)
    .outerRadius(radius);

		// Generate the pie
		var pie = d3.pie().value(d => d.Count);

		// Generate the arcs
		var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

		//Generate groups
		var arcs = svg1.selectAll("g")
					.data(pie(data))
					.enter()
					.append("g")
          .attr('d', d3.arc()
    .innerRadius(100)         // This is the size of the donut hole
    .outerRadius(radius)
  )
          .attr("transform", "translate(" + radius + "," + radius + ")")
					.attr("class", "arc")

		//Draw arc paths
		arcs.append("path")
			.attr("fill", function(d, i) {
				return color(i);
			})
			.attr("d", arc);

    arcs.append("text")
      .attr('transform', function(d){
        return 'translate('+label.centroid(d)+')';
      })
      .attr("text-anchor", "middle")
      .text(d => d.data.Age_Range)

    // svg1.append("g")
    //   .attr("transform", "translate(" + (width / 2 - 120) + "," + 10 + ")")
    //   .append('text')
    //   .attr("x", (width / 2))             
    //   .attr("y", 0 - (margin.top / 2))
    //   .attr("text-anchor", "middle")  
    //   .style("font-size", "16px") 
    //   .text("To meet new people");
});
d3.csv("data/hook_age.csv").then((data,error) => {
  if (error) throw error;

  var margin = { top: 10, right: 30, bottom: 50, left: 60 },
  width = 300 - margin.left - margin.right,
  height = 290 - margin.top - margin.bottom;
  var radius = width / 2;
  var innerRadius = 0;

		var svg2 = d3
    .select("#area2")
    .append('svg')
    .attr('id','svg2')
		.attr("width",width + margin.left + margin.right)
		.attr("height",height + margin.top + margin.bottom);

		var color = d3.scaleOrdinal(['#EBB9DF','#8CAE68','#D991BA','#60992D']);
    var label = d3.arc().innerRadius(2 * radius / 4)
    .outerRadius(radius);

		// Generate the pie
		var pie = d3.pie().value(d => d.Count);

		// Generate the arcs
		var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

		//Generate groups
		var arcs = svg2.selectAll("g")
					.data(pie(data))
					.enter()
					.append("g")
          .attr("transform", "translate(" + radius + "," + radius + ")")
					.attr("class", "arc")

		//Draw arc paths
		arcs.append("path")
			.attr("fill", function(d, i) {
				return color(i);
			})
			.attr("d", arc);

    arcs.append("text")
      .attr('transform', function(d){
        return 'translate('+label.centroid(d)+')';
      })
      .attr("text-anchor", "middle")
      .text(d => d.data.Age_Range)
});
d3.csv("data/entertainment_age.csv").then((data,error) => {
  if (error) throw error;

  var margin = { top: 10, right: 30, bottom: 50, left: 60 },
  width = 300 - margin.left - margin.right,
  height = 290 - margin.top - margin.bottom;
  var radius = width / 2;
  var innerRadius = 0;

		var svg2 = d3
    .select("#area3")
    .append('svg')
    .attr('id','svg2')
		.attr("width",width + margin.left + margin.right)
		.attr("height",height + margin.top + margin.bottom);

		var color = d3.scaleOrdinal(['#EBB9DF','#8CAE68','#D991BA','#60992D']);
    var label = d3.arc().innerRadius(2 * radius / 4)
    .outerRadius(radius);

		// Generate the pie
		var pie = d3.pie().value(d => d.Count);

		// Generate the arcs
		var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

		//Generate groups
		var arcs = svg2.selectAll("g")
					.data(pie(data))
					.enter()
					.append("g")
          .attr("transform", "translate(" + radius + "," + radius + ")")
					.attr("class", "arc")

		//Draw arc paths
		arcs.append("path")
			.attr("fill", function(d, i) {
				return color(i);
			})
			.attr("d", arc);

    arcs.append("text")
      .attr('transform', function(d){
        return 'translate('+label.centroid(d)+')';
      })
      .attr("text-anchor", "middle")
      .text(d => d.data.Age_Range)
});
d3.csv("data/relationship_age.csv").then((data,error) => {
  if (error) throw error;

  var margin = { top: 10, right: 30, bottom: 50, left: 60 },
  width = 300 - margin.left - margin.right,
  height = 290 - margin.top - margin.bottom;
  var radius = width / 2;
  var innerRadius = 0;

		var svg2 = d3
    .select("#area4")
    .append('svg')
    .attr('id','svg2')
		.attr("width",width + margin.left + margin.right)
		.attr("height",height + margin.top + margin.bottom);

		var color = d3.scaleOrdinal(['#EBB9DF','#8CAE68','#D991BA','#60992D']);
    var label = d3.arc().innerRadius(2 * radius / 4)
    .outerRadius(radius);

		// Generate the pie
		var pie = d3.pie().value(d => d.Count);

		// Generate the arcs
		var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

		//Generate groups
		var arcs = svg2.selectAll("g")
					.data(pie(data))
					.enter()
					.append("g")
          .attr("transform", "translate(" + radius + "," + radius + ")")
					.attr("class", "arc")

		//Draw arc paths
		arcs.append("path")
			.attr("fill", function(d, i) {
				return color(i);
			})
			.attr("d", arc);

    arcs.append("text")
      .attr('transform', function(d){
        return 'translate('+label.centroid(d)+')';
      })
      .attr("text-anchor", "middle")
      .text(d => d.data.Age_Range)
});


// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv", function(data) {

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.group)}).keys()

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 60])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8','#4daf4a'])

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.group); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())
})
