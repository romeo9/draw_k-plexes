
function showDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

var datasetName, nodes, edges;
var numberOfKplexes;
var maxNumberNodes = 24000;
var maxNumberEdges = 130497;

window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {

    var myDropdown = document.getElementById("myDropdown");
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
        remove_all();
      }
  }
  
  if(e.target.matches('.dataset')){
  		datasetName = e.target.id
      document.getElementById("dataset_name").innerHTML = "Dataset: "+datasetName;
  		read_graph_data();
      read_kplex_data();
  }
}

function set_values() {
	var rows = document.getElementById("dataset_values").childNodes
	for (var i = rows.length - 1; i >= 0; i--) {
		if(rows[i].classList == "numero_cricche"){
			//console.log(true)
		}
		if (rows[i].classList == "numero_kplessi") {
			rows[i].innerHTML = numberOfKplexes
		}
		if (rows[i].classList == "numero_archi") {
			rows[i].innerHTML = edges.length
		}
		if (rows[i].classList == "numero_nodi") {
			rows[i].innerHTML = nodes.length
		}
		   
	}
	draw_piechart();
  draw_scatter_plot();
}

function read_graph_data() {
	d3.json("../ndeConverter/"+datasetName+".json", function(error, data){
		if(error) throw error;
			nodes = data.nodes;
			edges = data.links;
			set_values();
	});

}

function read_kplex_data() {
  d3.csv("../2-plexes/cluster_output_"+datasetName+".csv", function(error, data){
    if(error) throw error;
      numberOfKplexes = data.length+1

  });
}

function draw_piechart() {
	var svg = d3.select("svg");
	var width = svg.attr("width");
	var height = svg.attr("height");

	var color = d3.scaleOrdinal(d3.schemeCategory20c)

    var radius = Math.min(width, height) / 2;

   var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.arc()
    .outerRadius(radius + 40)
    .innerRadius(radius + 40);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d; });

   var pie_group = svg.append("g").attr("id", "pie_group")
    .attr("transform", "translate(" + width / 4. + "," + height / 4. + ") scale(.5)");

    var data = [nodes.length, numberOfKplexes, edges.length ]

    var g = pie_group.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data); });

  g.append("text")
   .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + "), scale(1.5)"; }).transition()
      .attr("dy", ".35em")
      .text(function(d) { 
        if(d.data == data[0]){
        return d.data+" Nodi"; 
      }if(d.data == data[1]){
        return d.data+" K-plessi"
      }
        return d.data+" Archi";
      });   
}

function draw_scatter_plot(){
  var svg = d3.select("svg");
  var margin = 30;
  var width = svg.attr("width")-margin;
  var height = svg.attr("height")-margin;

  var color = d3.scaleOrdinal(d3.schemeCategory20c)

  var scatter_group = svg.append("g").attr("id", "scatter_group")
                    .attr("transform", "translate("+ width/8.*5 +","+ 0 +") scale(.6)");
  

  data = [nodes.length, edges.length]

  var x = d3.scaleLinear().range([0, width-(width/2.)]);
  var y = d3.scaleLinear().range([height, 0]);

  var valueline = d3.line()
    .x(data[0])
    .y(data[0]);

  scatter_group.append("g")
    .attr("transform",
          "translate(" + width/2. + "," + height/2. + ") scale(0.1)");

  x.domain([0, maxNumberNodes]);
  y.domain([0, maxNumberEdges]);

  scatter_group.append("path")
      .data(data)
      .attr("class", "line")
      .attr("d", valueline);

  scatter_group.selectAll("dot")
      .data(data)
    .enter().append("rect")
      //.attr("r", 20)
      .attr("x", function(d){return x(data[0])})
      .attr("y", function(d){return y(data[1])} )
      .attr("width", 20)
      .attr("height", function(d){ return height - y(data[1]);})
      .style("fill", function(d){return color(d.data)})
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);;

  scatter_group.append("g")
      .attr("id", "x_axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  scatter_group.append("text")
      .attr("transform", "translate(-60, "+height/2.+") rotate(-90)").text("Numero archi");
  scatter_group.append("text")
      .attr("transform", "translate("+width/4.+","+height*1.1+") ").text("Numero nodi");


  
  scatter_group.append("g")
      .attr("id","y_axis")
      .attr("transform", "translate(0,0)")
      .call(d3.axisLeft(y))
      .append("text").text("Numero Archi");

}

function handleMouseOver(d) {  
      radius = 20;
      d3.select(this).style("fill", "orange");
      var x = d3.select(this).attr("cx");
      var y = d3.select(this).attr("cy");
      var str = nodes.length+","+edges.length;

      d3.select("#scatter_group").append("text")
            .attr("id","info")
            .attr("x",x)
            .attr("y",y)
            .text(str);
}

function handleMouseOut(d) {
    var color = d3.scaleOrdinal(d3.schemeCategory20c)
    d3.select(this).style("fill", color(d.data))
    d3.select("#info").remove();  
}

function remove_all(){
	d3.select("svg").selectAll("g").remove();
}