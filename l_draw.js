var svg = d3.select("body")
			.append("svg")
			.attr("width",4900)
			.attr("height",4600);

	var width = svg.attr("width");
    var height = svg.attr("height");

	
	d3.json("ndeConverter/output.json", function(error, data){
		if(error) throw error;

		nodes = data.nodes;

		edges = data.links;
		draw_planar_graph(nodes, edges);

	});

	
function draw_planar_graph(nodes, edges){
	var dx = 10
	var dy = 10

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
					.attr("id", "edges");
	var nodeGroup = svg.append("g")
					.attr("id", "nodes")
					.attr("transform", [
            			"translate(0,0)",
            			"scale(1)"
          					].join(" "));

	var edge = edgeGroup.selectAll("path")
				.data(edges)
				.enter()
				.append("path")
				.attr("id", function(d){return d.source+"-"+d.target})
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
	

	var zoom = d3.behavior.zoom()
        // only scale up, e.g. between 1x and 50x
        .scaleExtent([1, 50])
        .on("zoom", function() {
          // the "zoom" event populates d3.event with an object that has
          // a "translate" property (a 2-element Array in the form [x, y])
          // and a numeric "scale" property
          var e = d3.event,
              // now, constrain the x and y components of the translation by the
              // dimensions of the viewport
              tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale)),
              ty = Math.min(0, Math.max(e.translate[1], height - height * e.scale));
          // then, update the zoom behavior's internal translation, so that
          // it knows how to properly manipulate it on the next movement
          zoom.translate([tx, ty]);
          // and finally, update the <g> element's transform attribute with the
          // correct translation and scale (in reverse order)
          nodes.attr("transform", [
            "translate(" + [tx, ty] + ")",
            "scale(" + e.scale + ")"
          ].join(" "));
        });
        svg.call(zoom);
}
