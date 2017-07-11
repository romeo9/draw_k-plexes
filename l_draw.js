
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
	for (var i = dy; i <height; i+=dy) {
		y_coordinates.push(i)
	}

	var points = create_points_list(x_coordinates, y_coordinates);
	console.log(points.length)
	

	//console.log(x_coordinates)
	//console.log(y_coordinates)


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
				.attr("stroke", "grey")
				.attr("stroke-width", 5);


	var node = nodeGroup.selectAll("circle")
				.data(nodes)
				.enter()
				.append("circle")
				.attr("id", function(d){return d.id})
				.attr("cx", function(d){
					var x = points[Math.floor(Math.random()*points.length)].x
					return x;
				})
				.attr("cy", function(d){
					var x = d3.select(this).attr("cx");
					var y = points[Math.floor(Math.random()*points.length)].y
					removeElem(points, x,y);
					return y
				})
				.attr("r", 15)
				.attr("fill", "black")
				.attr("stroke", "white")
				.attr("stroke-width", 5);
	console.log(points.length);
	console.log(points);

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
	
	//edge.curve(d3.curveStepBefore);

}

function create_points_list(x_coordinates, y_coordinates){
	var result = [];

	for (var i = 0; i < x_coordinates.length; i++) {
		for (var j = 0; j < y_coordinates.length; j++) {
			var point = new Point(x_coordinates[i], y_coordinates[j]);
			result.push(point);

		}
	}
	return result;
}

function removeElem(points, x, y){
	for (var i = 0; i < points.length; i++) {
		if(points[i].x == x | points[i].y == y){
			console.log("Rimosso: ("+ points[i].x +","+points[i].y+")");
			points.splice(i, 1);

		}
	}
}

