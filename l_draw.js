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
	for(var i=dx; i<430; i+=dx){
		x_coordinates.push(i)
	}
	var y_coordinates = []
	for (var i = dy; i<600; i+=dy) {
		y_coordinates.push(i)
	}

	var lineGenerator = d3.line().curve(d3.curveCatmullRomOpen);

	var numNodi = nodes.length;
	
	var edgeGroup = svg.append("g")
					.attr("id", "edges");
	var nodeGroup = svg.append("g")
					.attr("id", "nodes");

	var edge = edgeGroup.selectAll("line")
				.data(edges)
				.enter()
				.append("line")
				.attr("id", function(d){return d.source+d.target})
				.attr("source", function(d){return d.source})
				.attr("target", function(d){return d.target})
				.attr("stroke", "#dbdde6")
				.attr("stroke-width", 5);


	var node = nodeGroup.selectAll("circle")
				.data(nodes)
				.enter()
				.each(function(d) {
					var header = d3.select(this);
		            var x_index = Math.floor(Math.random()*x_coordinates.length);
		            var y_index = Math.floor(Math.random()*y_coordinates.length);
		            
		            if((x_coordinates[x_index] != null) && (y_coordinates[y_index] != null)){
		            	var circle = header.append("circle").attr("id",function(d){return d.id})
		            	
		            	circle.attr("cx", x_coordinates[x_index]);
		            	x_coordinates.splice(x_index, 1);
		            	
		            	circle.attr("cy", y_coordinates[y_index]);
		            	y_coordinates.splice(y_index, 1);
		            	
		            	circle.attr("r", 15)
						circle.attr("fill", "#095ae0")
						circle.attr("stroke", "white")
						circle.attr("stroke-width", 5)
		            }
		        	});




	edge.attr("x1", function(d){
			return d3.select("circle[id='"+d.source+"']").attr("cx")
		})
		.attr("y1", function(d){
			return d3.select("circle[id='"+d.source+"']").attr("cy")
		})
		.attr("x2", function(d){
			return d3.select("circle[id='"+d.target+"']").attr("cx")
		})
		.attr("y2", function(d){
			return d3.select("circle[id='"+d.target+"']").attr("cy")
		});
	
}

function create_points_list(x_coordinates, y_coordinates){
	var result = [];

	for (var i = 0; i < x_coordinates.length; i++) {
		for (var j = 0; j < y_coordinates.length; j++) {

			result.push([x_coordinates[i],y_coordinates[j]]);

		}
	}
	return result;
}

