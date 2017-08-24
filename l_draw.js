var width = window.innerWidth*.9;
var height = window.innerHeight*.8;
var toggle = 0;

var svg = d3.select("body")
			.append("svg")
			.attr("width",width)
			.attr("height",height).style("padding-top", 150);

	var width = svg.attr("width");
    var height = svg.attr("height");

d3.json("ndeConverter/output.json", function(error, data){
		if(error) throw error;

		nodes = data.nodes;

		links = data.links;

	var navbar = d3.select("header").select(".topnav");
      navbar.append("div").text("Numero nodi: "+nodes.length)
      navbar.append("div").text("Numero archi: "+links.length)

	var dx = 5
	var dy = 3

	var x_coordinates = []
	for(var i=dx; i<width; i+=dx){
		x_coordinates.push(i)
	}
	var y_coordinates = []
	for (var i = dy; i<height; i+=dy) {
		y_coordinates.push(i)
	}

	var numNodi = nodes.length;
	
	var edgeGroup = svg.append("g")
					.attr("id", "links");
	var nodeGroup = svg.append("g")
					.attr("id", "nodes")
					.attr("transform", [
            			"translate(0,0)",
            			"scale(1)"
          					].join(" "));

	var edge = edgeGroup.selectAll("path")
				.data(links)
				.enter().filter(function(d){ return (d.source < 100) && (d.target < 100)})
				.append("path")
				.attr("id", function(d){return d.source+"-"+d.target})
				.attr("source", function(d){return d.source})
				.attr("target", function(d){return d.target})
				.attr("stroke", "#dbdde6")
				.attr("stroke-width", 2)
				.attr("fill", "transparent");



var color = d3.scaleOrdinal(d3.schemeCategory10);


	var node = nodeGroup.selectAll("g")
				.data(nodes)
				.enter()
				.append("g").filter(function(d){return d.id < 100})
				.attr("id", function(d){return "nodo-"+d.id})
				.on("mouseover", handleMouseOver)
				.on("mouseout", handleMouseOut);

	var nodeCircle = node.each(function(d) {
					var header = d3.select(this);
		            var x_index = Math.floor(Math.random()*x_coordinates.length);
		            var y_index = Math.floor(Math.random()*y_coordinates.length);
		            
		            if((x_coordinates[x_index] != null) && (y_coordinates[y_index] != null)){
		            	var circle = header.append("circle").attr("id",function(d){return d.id})
		            	var cx = x_coordinates[x_index];
		            	circle.attr("cx", cx);
		            	x_coordinates.splice(x_index, 1);
		            	
		            	var cy = y_coordinates[y_index]
		            	circle.attr("cy", cy);
		            	y_coordinates.splice(y_index, 1);
		            	
		            	circle.attr("r", 10)
						circle.attr("fill", function(d){return color(d.group)}).attr("opacity",1)
						circle.attr("stroke", "white")
						circle.attr("stroke-width", 2);
						
						header.append("text")
    						.text(function(d) {
      							return d.id;
   							 })
    						.attr("x",cx-5)
    						.attr("y",cy+5)
    						.attr("font-size","10px")
    						.attr("fill", "white")
    						.attr("font-family", "sans-serif")
		            }
		        	});

	edge.attr("d", function(d){
			var x1 = d3.select("circle[id='"+d.source+"']").attr("cx")	
			var y1 = d3.select("circle[id='"+d.source+"']").attr("cy")
			var x2 = d3.select("circle[id='"+d.target+"']").attr("cx")
			var y2 = d3.select("circle[id='"+d.target+"']").attr("cy")

			var lineGenerator = d3.line()//.curve(d3.curveBundle.beta(1));
			var lineG = lineGenerator([[x1,y1],[x2,y1],[x2,y2]]);
			
			return lineG
		}).attr("stroke-linejoin","round");

	

});


function handleMouseOver(){
	var node = d3.select(this).select("circle")
		node.attr("stroke-width", 5)
	 	.attr("stroke", "black");

	var idNode = node.attr("id")

	var links = d3.select("g#links").selectAll("path").filter(function(d){
		if(d.source == idNode){
			d3.select("g#nodes").select("g#nodo-"+d.target).select("circle").attr("stroke-width", 5)
	 				.attr("stroke", "black");
	 		return true;
		}
		if(d.target == idNode){
			d3.select("g#nodes").select("g#nodo-"+d.source).select("circle").attr("stroke-width", 5)
	 				.attr("stroke", "black");
	 		return true;
		}
		return false;
	}).attr("stroke", "black")
				.attr("stroke-width", 3);

}

function handleMouseOut(){
	var node = d3.selectAll("circle")
	node.attr("stroke-width", 2)
	.attr("stroke", "white")

	var links = d3.selectAll("path").attr("stroke", "#dbdde6")
				.attr("stroke-width", 2)

}


