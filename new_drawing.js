canvasWidth = (screen.width)/100*95
canvasHeight = (screen.height)/100*65

var baseCanvas = d3.select("body")
					.append("svg")
					.attr("id","canvas")
					.attr("width", canvasWidth)
					.attr("height", canvasHeight)
					.attr("border",1)
/*
var canvasBorder = baseCanvas.append("rect")
       			.attr("x", 0)
       			.attr("y", 0)
       			.attr("height", canvasHeight)
       			.attr("width", canvasWidth)
       			.style("stroke", 'black')
       			.style("fill", "none")
       			.style("stroke-width", 1);
       			*/

var width = baseCanvas.attr("width");
var height = baseCanvas.attr("height");

var nodes,edges, dx,dy, strokeNode, strokeEdge, raggio, fontSize, plexes;
var toggle = 0;
console.log(toggle)

var dataset = "ca-CondMat"
document.getElementById("dataset").textContent = "Dataset: "+dataset

d3.json("ndeConverter/"+dataset+".json", function(error, data){
	if(error) throw error;
	nodes = data.nodes;
	edges = data.links;

	var navbar = d3.select("header").select(".topnav");
	document.getElementById('nodeNumber').textContent = nodes.length.toString();
	document.getElementById('edgeNumber').textContent = edges.length.toString();


	d3.text("2-plexes/cluster_output_ca-CondMat_2_21.csv", function(error, data) {
       	if(error) throw error;
       	plexes = d3.csvParseRows(data);
       			//console.log(plexes)

       	createPagination(plexes)
       	
       	
		plexes.sort(function(a, b){return b.length - a.length;});

    	biggestPlexLength = plexes[0].length;


		if(biggestPlexLength > 100){
			dx = width/100.;
			dy = height/100.;
		}
		if(biggestPlexLength < 10){
			dx = width/20.
			dy = height/20.
		}
		else{
			dx = width/(2.*biggestPlexLength)
			dy = height/(2.*biggestPlexLength)
		}		

	});

});


function create_single_plexes(plex){
		strokeEdge = dy/8.
		strokeNode = dy/6.
		raggio = dy/2.
		fontSize = dy/2.2
		var xRangeMin = width/4;
		var xRangeMax = (width/4)*3;

		var yRangeMin = (height/4);
		var yRangeMax = (height/4)*3;

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
					return plexes[plex].includes(String(d.source)) && plexes[plex].includes(String(d.target))
				})
				.append("path")
				.attr("id", function(d){return d.source+"-"+d.target})
				.attr("source", function(d){return d.source})
				.attr("target", function(d){return d.target})
				.attr("stroke", "#dbdde6")
				.attr("stroke-width", strokeEdge)
				.attr("fill", "transparent");

		var node = nodeGroup.selectAll("circle")
		.data(plexes[plex])
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
            				.attr("id", d)
            				.attr("cx", cx)
							.attr("cy", cy)
							.attr("r", function(){if(raggio<1.){ return 1 }else{return raggio}})
							.attr("fill", "red")
							//.attr("stroke", "white")
							//.attr("stroke-width", strokeNode)
							
            	
            	x_coordinates.splice(x_index, 1);
            	y_coordinates.splice(y_index, 1);
            	
            	circleNode.append("text")
					.text(function(d) {return d;})
					.attr("id", d)
					.attr("x",cx)
					.attr("y",cy+2)
					.attr("text-anchor", "middle")
					.attr("font-size", parseInt(fontSize) + "px")
					.attr("fill", "white")
					.attr("font-family", "sans-serif")

			
			
		}

		})
		
		edge.attr("d", function(d){
			var x1 = d3.select("g[id='"+d.source+"']").select("circle").attr("cx")	
			var y1 = d3.select("g[id='"+d.source+"']").select("circle").attr("cy")
			var x2 = d3.select("g[id='"+d.target+"']").select("circle").attr("cx")
			var y2 = d3.select("g[id='"+d.target+"']").select("circle").attr("cy")

			var lineGenerator = d3.line()//==.curve(d3.curveBundle.beta(1));
			var lineG = lineGenerator([[x1,y1],[x2,y1],[x2,y2]]);
			
			
			return lineG
			
			})

}

function handleMouseOver(){
	d3.select(this).select("circle").attr("r", raggio*2)
    d3.select(this).select("text").attr("font-size", parseInt(fontSize*1.6) + "px")

    var node = d3.select(this).select("circle")
		node.attr("stroke-width", strokeNode)
	 	.attr("stroke", "black");

    var idNode = node.attr("id")

	var links = d3.select("g#edges").selectAll("path")
	links.filter(function(d){
		if(d.source == idNode){
			d3.select("g[id='nodes']").select("g[id='"+d.target+"']").select("circle").attr("stroke-width", strokeNode)
	 				.attr("stroke", "black");
	 		return true;
		}
		if(d.target == idNode){
			d3.select("g#nodes").select("g[id='"+d.source+"']").select("circle").attr("stroke-width", strokeNode)
	 				.attr("stroke", "black");
	 		return true;
		}
		return false;
	}).attr("stroke", "black")
	.attr("stroke-width", strokeEdge+ strokeEdge*2);

}

function handleMouseOut(){
	d3.select(this).select("circle").attr("r", raggio)
    d3.select(this).select("text").attr("font-size", parseInt(fontSize) + "px")

    var node = d3.selectAll("circle")
	node.attr("stroke-width", 0)
	.attr("stroke", "none");

	var links = d3.selectAll("path").attr("stroke", "#dbdde6")
				.attr("stroke-width", strokeEdge)
}

function draw(plex){
	if(toggle == 1){
		d3.selectAll("g").remove()
		toggle = 0;
		
	}
	if(toggle == 0){
		create_single_plexes(plex)
		toggle = 1;
		return

	}

}



function createPagination(plexes){

	document.getElementById("numberkplexes").textContent = plexes.length
	var ul = document.getElementById("pagination")
       	var li,a;

       	var span1 = document.createElement("span")
       	span1.setAttribute("aria-hidden", true)
       	span1.appendChild(document.createTextNode('<<'))
       	
       	var span2 = document.createElement("span")
       	span2.setAttribute("class","sr-only")
       	span2.appendChild(document.createTextNode("Previous"))
       	
       	var arrowLeftA = document.createElement("a")
       	arrowLeftA.setAttribute("class", "page-link")
       	arrowLeftA.setAttribute("href", "#")
       	arrowLeftA.setAttribute("aria-label", "Previous")
       	arrowLeftA.appendChild(span1)
       	arrowLeftA.appendChild(span2)

       	var arrowLeftLi = document.createElement("li")
       	arrowLeftLi.setAttribute("class","page-item")
       	arrowLeftLi.appendChild(arrowLeftA)
       	ul.appendChild(arrowLeftLi)

       	for (var i = 0;i<plexes.length;i++) {
       		li = document.createElement("li")
       		a = document.createElement("a")
       		a.setAttribute("class", "page-link")
       		a.setAttribute("href", "#")
       		a.setAttribute("onclick", "return draw("+i+")")
       		a.appendChild(document.createTextNode(i+1))
       		li.appendChild(a);
  			li.setAttribute("id", i); // added line
  			li.setAttribute("class","page-item")
  			ul.appendChild(li);
       	}
		
       	var span3 = document.createElement("span")
       	span3.setAttribute("aria-hidden", true)
       	span3.appendChild(document.createTextNode('>>'))
       	
       	var span4 = document.createElement("span")
       	span4.setAttribute("class","sr-only")
       	span4.appendChild(document.createTextNode("Next"))
       	
       	var arrowRightA = document.createElement("a")
       	arrowRightA.setAttribute("class", "page-link")
       	arrowRightA.setAttribute("href", "#")
       	arrowRightA.setAttribute("aria-label", "Next")

       	arrowRightA.appendChild(span3)
       	arrowRightA.appendChild(span4)

       	var arrowRightLi = document.createElement("li")
       	arrowRightLi.setAttribute("class","page-item")
       	arrowRightLi.appendChild(arrowRightA)
       	ul.appendChild(arrowRightLi)
}
