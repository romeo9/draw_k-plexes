var svg = d3.select("body")
			.append("svg")
			.attr("width",960)
			.attr("height",600);

	var width = svg.attr("width");
    var height = svg.attr("height");

	
	d3.json("example.json", function(error, data){
		if(error) throw error;

		nodes = data.nodes;
		edges = data.links;
		
		draw_planar_graph(nodes, edges);

	});

	
function draw_planar_graph(nodes, edges){
	var dx = 60
	var dy = 60

	var x_coordinates = []
	for(var i=dx; i<width; i+=dx){
		x_coordinates.push(i)
	}
	var y_coordinates = []
	for (var i = dy; i<height; i+=dy) {
		y_coordinates.push(i)
	}
	console.log(x_coordinates)
	console.log(y_coordinates)

	var numNodi = nodes.length;
	
	var edgeGroup = svg.append("g")
					.attr("id", "edges");
	var nodeGroup = svg.append("g")
					.attr("id", "nodes");

	var edge = edgeGroup.selectAll("path")
				.data(edges)
				.enter()
				.append("path")
				.attr("id", function(d){return d.source+d.target})
				.attr("source", function(d){return d.source})
				.attr("target", function(d){return d.target})
				.attr("stroke", "#dbdde6")
				.attr("stroke-width", 5)
				.attr("fill", "transparent");


	var node = nodeGroup.selectAll("circle")
				.data(nodes)
				.enter()
				.each(function(d) {
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
		            	
		            	circle.attr("r", 15)
						circle.attr("fill", "#095ae0")
						circle.attr("stroke", "white")
						circle.attr("stroke-width", 5);
						
						header.append("text")
    						.text(function(d) {
      							return d.id;
   							 })
    						.attr("x",cx-5)
    						.attr("y",cy+5)
    						.attr("font-size","20px")
    						.attr("fill", "white")
    						.attr("font-family", "sans-serif")
		            }
		        	});




	edge.attr("d", function(d){
			var x1 = d3.select("circle[id='"+d.source+"']").attr("cx")	
			var y1 = d3.select("circle[id='"+d.source+"']").attr("cy")
			var x2 = d3.select("circle[id='"+d.target+"']").attr("cx")
			var y2 = d3.select("circle[id='"+d.target+"']").attr("cy")

			var lineGenerator = d3.line().curve(d3.curveBundle.beta(1));
			var lineG = lineGenerator([[x1,y1],[x2,y1],[x2,y2]]);
			
			return lineG
		}).attr("stroke-linejoin","round");
	
}
