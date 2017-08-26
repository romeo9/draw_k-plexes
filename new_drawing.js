canvasWidth = (screen.width)/100*98
canvasHeight = (screen.height)/100*65

var baseCanvas = d3.select("body")
					.append("svg")
					.attr("id","canvas")
					.attr("width", canvasWidth)
					.attr("height", canvasHeight)
					.attr("border",1)

var canvasBorder = baseCanvas.append("rect")
       			.attr("x", 0)
       			.attr("y", 0)
       			.attr("height", canvasHeight)
       			.attr("width", canvasWidth)
       			.style("stroke", 'black')
       			.style("fill", "none")
       			.style("stroke-width", 1);

var width = baseCanvas.attr("width");
var height = baseCanvas.attr("height");


d3.json("ndeConverter/jazz.json", function(error, data){
	if(error) throw error;
	nodes = data.nodes;
	edges = data.links;

	var navbar = d3.select("header").select(".topnav");
    navbar.append("div").text("Numero nodi: "+nodes.length)
    navbar.append("div").text("Numero archi: "+edges.length)
	
	draw_plexes(nodes, edges);
});

var dx,dy;


function draw_plexes(nodes, edges){

	d3.text("2-plexes/cluster_output_jazz_2_24.csv", function(error, data) {
       	if(error) throw error;
       	plexes = d3.csvParseRows(data);

		
		plexes.sort(function(a, b){return b.length - a.length;});
		console.log(plexes)

    	biggestPlexLength = plexes[0].length;

		var xRangeMin = width/4;
		var xRangeMax = (width/4)*3;

		var yRangeMin = (height/4);
		var yRangeMax = (height/4)*3;

		dx = (width/2)/biggestPlexLength;
		dy = (height/2)/biggestPlexLength;

		var x_coordinates = []
		for(var i = xRangeMin; i < xRangeMax; i += dx){
			x_coordinates.push(i)
		}
		var y_coordinates = []
		for (var i = yRangeMin; i < yRangeMax; i += dy) {
			y_coordinates.push(i)
		}

		var edgeGroup = baseCanvas.append("g")
									.attr("id", "edges");
		var nodeGroup = baseCanvas.append("g")
									.attr("id", "nodes");

		var edge = edgeGroup.selectAll("path")
				.data(edges)
				.enter().filter(function(d){
					return plexes[0].includes(String(d.source)) && plexes[0].includes(String(d.target))
				})
				.append("path")
				.attr("id", function(d){return d.source+"-"+d.target})
				.attr("source", function(d){return d.source})
				.attr("target", function(d){return d.target})
				.attr("stroke", "#dbdde6")
				.attr("stroke-width", 1)
				.attr("fill", "transparent");

		var node = nodeGroup.selectAll("circle")
		.data(plexes[0])
		.enter()
		.each(function(d) {
			var header = d3.select(this);
            var x_index = Math.floor(Math.random()*x_coordinates.length);
            var y_index = Math.floor(Math.random()*y_coordinates.length);
            
            if((x_coordinates[x_index] != null) && (y_coordinates[y_index] != null)) {

            	var cx = x_coordinates[x_index];
            	var cy = y_coordinates[y_index];

            	var circleNode = header.append("g")
            							.attr("id",function(d){return d})
            							.on("mouseover", handleMouseOver)
										.on("mouseout", handleMouseOut);

            	circleNode.append("circle")
            				.attr("id", "circle" + d)
            				.attr("cx", cx)
							.attr("cy", cy)
							.attr("r", dy/2)
							.attr("fill", "red")
							.attr("stroke", "white")
							.attr("stroke-width", dy/4)
							
            	
            	x_coordinates.splice(x_index, 1);
            	y_coordinates.splice(y_index, 1);
            	
            	circleNode.append("text")
					.text(function(d) {return d;})
					.attr("id", "node_" + d)
					.attr("x",cx)
					.attr("y",cy+2)
					.attr("text-anchor", "middle")
					.attr("font-size", parseInt(dy/2.2) + "px")
					.attr("fill", "white")
					.attr("font-family", "sans-serif")


			}

		})
		
		edge.attr("d", function(d){
			var x1 = d3.select("g[id='"+d.source+"']").select("circle").attr("cx")	
			var y1 = d3.select("g[id='"+d.source+"']").select("circle").attr("cy")
			var x2 = d3.select("g[id='"+d.target+"']").select("circle").attr("cx")
			var y2 = d3.select("g[id='"+d.target+"']").select("circle").attr("cy")

			var lineGenerator = d3.line()//.curve(d3.curveBundle.beta(1));
			var lineG = lineGenerator([[x1,y1],[x2,y1],[x2,y2]]);
			
			
			return lineG
			
	})//.attr("stroke-linejoin","round");



});
}

function handleMouseOver(){
	d3.select(this).select("circle").attr("r", dy*2)
    d3.select(this).select("text").attr("font-size", parseInt(dy*1.6) + "px")

    var node = d3.select(this).select("circle")
		node.attr("stroke-width", 5)
	 	.attr("stroke", "black");

    var idNode = node.attr("id")

	var links = d3.select("g#edges").selectAll("path").filter(function(d){
		if(d.source == idNode){
			d3.select("g#nodes").select("g#"+d.target).select("circle").attr("stroke-width", 5)
	 				.attr("stroke", "black");
	 		return true;
		}
		if(d.target == idNode){
			d3.select("g#nodes").select("g#"+d.source).select("circle").attr("stroke-width", 5)
	 				.attr("stroke", "black");
	 		return true;
		}
		return false;
	}).attr("fill", "black")
				.attr("stroke-width", 3);
}

function handleMouseOut(){
	d3.select(this).select("circle").attr("r", dy/2)
    d3.select(this).select("text").attr("font-size", parseInt(dy/2.2) + "px")

    var node = d3.selectAll("circle")
	node.attr("stroke-width", 2)
	.attr("stroke", "white");

	var links = d3.selectAll("path").attr("stroke", "#dbdde6")
				.attr("stroke-width", 2)
}

