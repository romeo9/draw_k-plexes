
var svg = d3.select("body")
			.append("svg")
			.attr("width",960)
			.attr("height",600);

	var width = svg.attr("width");
    var height = svg.attr("height");

	
	d3.json("ndeConverter/example.json", function(error, data){
		if(error) throw error;

		nodes = data.nodes;
		edges = data.links;
		
		draw_random_graph(nodes, edges);

	});

	var dy = 100,
		dx = 120

function draw_random_graph(nodes, edges){
	var edgeGroup = svg.append("g")
					.attr("id", "edges");
	var nodeGroup = svg.append("g")
					.attr("id", "nodes");


	var edge = edgeGroup.selectAll("line")
				.data(edges)
				.enter()
				.append("line")
				.attr("source", function(d){return d.source})
				.attr("target", function(d){return d.target})
				.attr("stroke", "grey")
				.attr("stroke-width", 5);

	var node = nodeGroup.selectAll("circle")
				.data(nodes)
				.enter()
				.append("circle")
				.attr("id", function(d){return d.id})
				.attr("cx", function(){return Math.random()*(width)})
				.attr("cy", function(){return Math.random()*(height)})
				.attr("r", 15)
				.attr("fill", "rgb(23, 139, 202)")
				.attr("stroke", "white")
				.attr("stroke-width", 5);
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

	
