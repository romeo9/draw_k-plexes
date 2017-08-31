canvasWidth = (screen.width)/100*95
canvasHeight = (screen.height)/100*65

var baseCanvas = d3.select("body")
					.append("svg")
					.attr("id","canvas")
					.attr("width", canvasWidth)
					.attr("height", canvasHeight)

/*
//TODO: claudia should fix this
var canvasBorder = baseCanvas.append("rect")
				.attr("id", "canvasBorder")
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

var dataset = "ca-CondMat"
var plexes;

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
       	plexes = d3.csvParseRows(data).sort(function(a, b){return b.length - a.length;});

       	createPagination(plexes)
       	drawStackedGraph(nodes, edges, plexes)

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
			dx = width/(2.*(biggestPlexLength))
			dy = height/(2.*(biggestPlexLength))
		}		

	});

});

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function drawStackedGraph(nodes, edges, plexes) {
	var plexesData = countPlexes(nodes, edges, plexes)
	var plexesNumber = plexesData[0]
	var plexesEdges = plexesData[1]
	var isClique = []
	for (i = 0; i < plexes.length; i++) {
		plexesLength = plexes[i].length
		cliqueEdgeNumber = plexesLength*(plexesLength-1)
		cliqueEdgeNumber = cliqueEdgeNumber/2
		if (cliqueEdgeNumber == plexesNumber[i]) {
			isClique.push(true)
		}
		else {
			isClique.push(false)}
	}
	//console.log("Cliques : " + isClique)
	//console.log("Number of edges in plex : " + plexesNumber)
	
	edgesInPlexes = findEdges(isClique, plexes, plexesEdges)
	
	//missingEdges = findMissingEdges(isClique, edgesInPlexes, plexes)
	
	console.log(edgesInPlexes)
	console.log(plexes)
	}

//TODO
function findMissingEdges(isClique, edgesInPlexes, plexes) {
	result = []
	return
}


function findEdges(isClique, plexes, plexesEdges) {
	var result = []
	for (i = 0; i < plexes.length; i++) {
		result.push({})
		for (j = 0; j < plexes[i].length; j++) {
			var obj = {}
			var node = plexes[i][j]
			obj[node] = []
			result[i][node] = []
		}
	}
	//return result

	for (i = 0; i < plexesEdges.length; i++) {
		if (!isClique[i]) {
			for (j = 0; j < plexesEdges[i].length; j++) {
				node1 = plexesEdges[i][j].source.toString()
				node2 = plexesEdges[i][j].target.toString()
				if (result[i][node1] == null) {
					result[i].push({node1:[]})
				}
				if (result[i][node2] == null) {
					result[i].push({node2:[]})
				}
				result[i][node1].push(node2)
				result[i][node2].push(node2)
			}
		}
	}
	return result
}



//troppo pesante
/*
function findMissingEdges(isClique, plexes, plexesEdges) {
	var result = []
	for (i = 0; i < plexes.length; i++) {
		console.log(i)
		result.push([])
		if (!isClique[i]) {
			for (j = 0; plexes[i].length; j++) {
				//console.log(plexes[i][j])
				for (k = j+1; k < plexes[i].length-1;) {
					jkEdge = {source:plexes[j][k].toString(), target:plexes[k][j].toString()}
					kjEdge = {source:plexes[k][j].toString(), target:plexes[j][k].toString()}
					if (plexesEdges.includes(jkEdge) < 0 && plexesEdges.includes(kjEdge) < 0) {
						result[i].push(jkEdge)
					}
				}
			}
		}
	}
	return result
}
*/

function countPlexes(nodes, edges, plexes) {
	result = Array.apply(null, Array(plexes.length)).map(Number.prototype.valueOf,0);
	res = []
	for (j = 0; j < plexes.length; j++) {
		res.push([])
	}
	for (edge in edges) {
		for (i = 0; i < plexes.length; i++) {
			//if (edges[edge].source in plexes[i] && edges[edge].target in plexes[i]) {
			if (plexes[i].includes(edges[edge].source.toString()) > 0 && plexes[i].includes(edges[edge].target.toString()) > 0) {
				result[i] += 1;
				res[i].push({source:edges[edge].source.toString(), target:edges[edge].target.toString()})
			}
		}
	}
	return [result, res]

}

function create_single_plexes(plex){

		biggestPlexLength = plexes[plex].length

		strokeEdge = dy/8.
		strokeNode = dy/6.
		raggio = dy/2.
		fontSize = dy/2.2

		var xRangeMin = canvasWidth/4.
		var xRangeMax = parseFloat(width) - xRangeMin

		var yRangeMin = canvasHeight/4.
		var yRangeMax = parseFloat(height) - yRangeMin

		var innerWidth = xRangeMax - xRangeMin
		var innerHeight = yRangeMax - yRangeMin

		if(biggestPlexLength > 100){
			dx = innerWidth/100.*(biggestPlexLength);
			dy = innerHeight/100.*(biggestPlexLength);
		}
		if(biggestPlexLength < 10){
			dx = innerWidth/20.*(biggestPlexLength)
			dy = innerHeight/20.*(biggestPlexLength)
		}
		else{
			dx = innerWidth/parseFloat(biggestPlexLength)
			dy = innerHeight/parseFloat(biggestPlexLength)
		}	

		var x_coordinates = []
		for(var i = xRangeMin; i < xRangeMax; i += dx){
			x_coordinates.push(i)
		}

		var y_coordinates = []
		for (var i = yRangeMin; i < yRangeMax; i += dy) {
			y_coordinates.push(i)
		}
		
		if(x_coordinates.length > biggestPlexLength){
			x_coordinates.splice(x_coordinates.length-1,1)
		}
		if(y_coordinates.length > biggestPlexLength){
			y_coordinates.splice(y_coordinates.length-1,1)
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

		});
		
		edge.attr("d", function(d){

			//coordinate punto sorgente
			var x1 = d3.select("g[id='"+d.source+"']").select("circle").attr("cx")
			var y1 = d3.select("g[id='"+d.source+"']").select("circle").attr("cy")

			//coordinate punto target
			var x2 = d3.select("g[id='"+d.target+"']").select("circle").attr("cx")
			var y2 = d3.select("g[id='"+d.target+"']").select("circle").attr("cy")

			

			var lineGenerator = d3.line()
			var line;
			line = lineGenerator([[x1,y1],[x1,y2],[x2,y2]]);
				
			return line

			});

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

		//Mostra solo archi uscenti
		if(d.source == idNode){
			d3.select("g[id='nodes']").select("g[id='"+d.target+"']").select("circle").attr("stroke-width", strokeNode)
	 				.attr("stroke", "black");
	 		return true;
		}

		//Mostra solo archi entranti
		if(d.target == idNode){
			d3.select("g#nodes").select("g[id='"+d.source+"']").select("circle").attr("stroke-width", strokeNode)
	 					.attr("stroke", "black");
	 		return true;
		}

		return false;
	}).attr("stroke", "black")
	.attr("stroke-width", strokeEdge+ strokeEdge*2)
	.moveToFront();

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

       		a.setAttribute("onclick","return draw("+i+")")
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
