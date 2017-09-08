
function showDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

//Variabili globali. 
//Il nome del dataset viene aggiornato quando si clicca sul tasto "Select dataset.."
//e viene aggiornato nel metodo .onclick
//Dopo che viene aggiornato rimane aggiornato fino al successivo click
var datasetName, nodes, edges, isClique, plexes, width, height, plex2numbers = [];
var numberOfKplexes, numberOfCliques, cliques_color,dx,dy, kplex_color, nodeRadius;
var maxNumberNodes = 24000;
var maxNumberEdges = 140000;
var canvasWidth = (screen.width)/100*95
var canvasHeight = (screen.height)
var colors = ["E87E04","26c281","F4B350"];
//var mainContainer = d3.select("#mainContainer").attr("width", canvasWidth).attr("height", canvasHeight)
cliques_color = "caebf2"
kplex_color = "ff3B3f"

var clicked = 0;
width = screen.width*.95;
height = screen.height*.65;

var showMissingEdges = false;

//Gestisce l'evento click sulla schermata
var dropMenu = document.getElementById("myDropdown");

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

//click on dropdown menu
dropMenu.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
    var myDropdown = document.getElementById("myDropdown");

      if (dropMenu.classList.contains('show')) {
        dropMenu.classList.remove('show');
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


//click on window
window.onclick = function(e) {

	if (dropMenu.classList.contains('show') && !e.target.matches('.dropbtn')) {
		 dropMenu.classList.remove('show');
	}

	
	if(e.target.matches('#missingEdgesCheckbox')){
		showMissingEdges = e.target.checked
		if(showMissingEdges == true){
			d3.select("g#missingEdgesGroup").selectAll("path").attr("stroke", "red")
							.attr("stroke-width", strokeEdge)
							.attr("fill", "transparent")
		}
		if(showMissingEdges == false){
			d3.select("g#missingEdgesGroup").selectAll("path").attr("stroke", "none")
							.attr("stroke-width", strokeEdge)
							.attr("fill", "transparent")
		}
	}
	
}

function create_plex2numbers(){
	plex2numbers = []

    for (var i = 0; i < plexes.length; i++) {
    	
	    var singleObject = {
	    	"id": plexes[i].length,
	    	"isClique": isClique[i],
	    	"index": i
	    }
	    plex2numbers.push(singleObject)
	    
    	
    }
}	

function set_values() {

    drawStackedGraph(nodes, edges, plexes);
    numberOfCliques = countInArray(isClique, true)
    create_plex2numbers();
    
	var rows = document.getElementById("dataset_values").childNodes
	for (var i = rows.length - 1; i >= 0; i--) {
		if(rows[i].classList == "numero_cricche"){
			rows[i].innerHTML = numberOfCliques
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
  	draw_bar_chart();
	
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
  d3.text("../2-plexes/cluster_output_"+datasetName+".csv", function(error, data){
    if(error) {throw error;}
    else{
      plexes = d3.csvParseRows(data).sort(function(a, b){return b.length - a.length;});
      numberOfKplexes = plexes.length
    
  	} 
  });
}

function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
}


function draw_piechart() {
	var pieSvg = d3.select("#pieChartContainer");

	pieSvg.attr("width", width*.5).attr("height", height*.6)

	//var color = d3.scaleOrdinal(d3.schemeCategory20c)

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

   var pie_group = pieSvg.append("g").attr("id", "pie_group")
    .attr("transform", "translate(" + width / 5. + "," + height / 4. + ") scale(.5)");

    var data = [nodes.length, numberOfKplexes, edges.length ]

    var g = pie_group.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d,i) { return colors[i]; });

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

function draw_bar_chart(){

  var barSvg = d3.select("#barChartContainer");
  
  barSvg.attr("width", width*.5).attr("height", height)

  var bar_chart = barSvg.append("g").attr("id", "bar_chart")
                    .attr("transform", "translate("+width/8.+") scale(.65)")
  
  data = plex2numbers.reverse()
  
  var x = d3.scaleBand().range([0,width-(width/2.)]);
  var y = d3.scaleLinear().range([height,0]);

  var valueline = d3.line()
    .x(data.length)
    .y(plexes.length);

  x.domain(data.map(function(d){ return d.id; })).paddingInner([0.1])
	    .paddingOuter([0.3])
	    .align([0.5]);
  y.domain([0, data.length]);

  var cliques_group = bar_chart.append("g")
  			.attr("id", "cliques_group")
  			.attr("fill", cliques_color)

  var kplex_group = bar_chart.append("g")
  			.attr("id", "kplex_group")
  			.attr("fill", kplex_color)

var count = 0;
var idplex = data[0].id;
  cliques_group.selectAll("rect")
  				.data(data)
  				.enter()
  				.append("rect")
  				.attr("index", function(d){return d.index})
  				.attr("isClique",function(d){return d.isClique})
  				.attr("x", function(d){return x(d.id)})
  				.attr("y", function(d,i){
  					if(idplex == d.id) {
  						count=count+1; 
  					}else {
  						count = 1; 
  						idplex = d.id
  					}
  					return y(count)})
  				.attr("width", x.bandwidth())
			    .attr("height", function(d,i){ return height/data.length})
			    .style("fill",function(d){
			    	if(d.isClique==true){
			    		return cliques_color
			    	}
			    	return kplex_color
			    	
			    })
			    .on("mouseover", handleMouseOver)
			    .on("mouseout", handleMouseOut)
			    .on("click", clickPlex);

  bar_chart.append("g")
      .attr("id", "x_axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  bar_chart.append("text")
      .attr("transform", "translate(-60, "+height/2.+") rotate(-90)").text("Cricche/K-plessi");
  bar_chart.append("text")
      .attr("transform", "translate("+width/4.+","+height*1.1+") ").text("Numero nodi crescente");


  
  bar_chart.append("g")
      .attr("id","y_axis")
      .call(d3.axisLeft(y).tickFormat(function(d){
      	if(Math.floor(d)!= d){
      		return;
      	}
      	return d;
      }))
      .append("text").text("Numero Archi");


  var legend = bar_chart.append("g")
  	 .attr("id", "legend")
  	 .attr("transform", "translate("+width/2.+",0)")

  var cliques_legend = legend.append("rect")
  		.attr("id", "cliques_legend")
  		.attr("height", 20)
  		.attr("width", 20)
  		.style("fill", cliques_color)

  	legend.append("text").text("Cricche")
  		.attr("transform", "translate(30,15)")

  var kplex_legend =legend.append("rect")
  		.attr("id", "kplex_legend")
  		.attr("height", 20)
  		.attr("width", 20)
  		.style("fill", kplex_color)
  		.attr("transform", "translate(0,"+40+")")

  	legend.append("text").text("Kplessi")
  		.attr("transform", "translate(30,55)")


}

function clickPlex(){
	var cliqueness = d3.select(this).attr("isClique")

	if(clicked==0){
		clicked = 1;
		var indexPlex = d3.select(this).attr("index")
		
		var nodes = plexes[indexPlex]
		window.location.href = "#graphContainer"
		document.getElementById("goTopButton").style.display = "block"
		
	}
	if(clicked == 1){
		d3.select("#graphContainer").selectAll("g").remove()
		clicked = 0;
		var title = document.getElementById("graphTitle")
		title.style.display = "block"
		title.style.textAlign = "center"
		title.style.backgroundColor = "#333"
		title.style.color = "white"
		title.style.borderRadius = "17px"
		title.style.height = "4em"
		title.style.paddingTop = "2em"


		if(cliqueness == "false"){
			input = document.createElement("input");
			input.type = "checkbox"
			input.id = "missingEdgesCheckbox"

			divCheckbox = document.getElementById("checkboxKplex")
			divCheckbox.style.display = "block"
			divCheckbox.textContent = "Show missing edges"
			divCheckbox.style.color = "black"
			divCheckbox.appendChild(input)
		}else{
			d3.select("#checkboxKplex").selectAll("input").remove()
			document.getElementById("checkboxKplex").innerHTML = ""
		}
		
		create_single_plexes(indexPlex)
	}
}



function handleMouseOver(d) {  
      radius = 20;
      d3.select(this).attr("stroke", "black").attr("stroke-width", "3");
      var x = d3.select(this).attr("x");
      var y = d3.select(this).attr("y");
      var str;
      if(d.isClique == true) str = "Cricca"
      else str = "K-plesso"

      d3.select("#bar_chart").append("text")
            .attr("id","info")
            .attr("x",x)
            .attr("y",y-20)
            .text(str);
}

function handleMouseOut(d) {
    var nodo = d3.select(this)
    if(nodo.attr("isClique") == "true"){
    	nodo.attr("stroke-width", 0)
    }
    if(nodo.attr("isClique") == "false"){
    	nodo.attr("stroke-width", 0)
    }
    
    d3.select("#info").remove();  
}

function remove_all(){
	d3.select("svg#pieChartContainer").selectAll("g").remove();
	d3.select("svg#barChartContainer").selectAll("g").remove();
	d3.select("svg#graphContainer").selectAll("g").remove();
	document.getElementById("checkboxKplex").style.display = "none"
}


function drawStackedGraph(nodes, edges, plexes) {
	var plexesData = countPlexes(nodes, edges, plexes)
	var plexesNumber = plexesData[0]
	var plexesEdges = plexesData[1]
	isClique = []
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

	edgesInPlexes = findEdges(isClique, plexes, plexesEdges)
	missingEdges = findMissingEdges2(isClique, edgesInPlexes, plexes)


	}

function findMissingEdges(isClique, edgesInPlexes, plexes) {
	result = []
	for (i = 0; i < edgesInPlexes.length; i++) {
		result.push({})
		for (node in edgesInPlexes[i]) {
			result[i][node] = []
		}
		if (!isClique[i]) {
			for (node in edgesInPlexes[i]) {
				toCompare = plexes[i]
				toRemove = edgesInPlexes[i][node]
				var missingEdges = toCompare.filter(function(item) {
					return toRemove.indexOf(item) === -1;
				})
				if (missingEdges != undefined) {
					index = missingEdges.indexOf(node)
					missingEdges.splice(index, 1);
					result[i][node].push(missingEdges)
				}
			}
		}		
	}
	return result
}

function findMissingEdges2(isClique, edgesInPlexes, plexes) {
  result = []
  for (i = 0; i < edgesInPlexes.length; i++) {
    result.push([])
    if (!isClique[i]) {
      for (node in edgesInPlexes[i]) {
        toCompare = plexes[i]
        toRemove = edgesInPlexes[i][node]
        missingEdges = toCompare.filter(function(item) {
          return toRemove.indexOf(item) === -1;
        })
        if (missingEdges != undefined) {
          index = missingEdges.indexOf(node)
          missingEdges.splice(index, 1);
          obj = {}
          obj["id"] = node
          obj["edges"] = missingEdges
          result[i].push(obj)
        }
      }
    }   
  }
  return result
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
				result[i][node2].push(node1)
			}
		}
	}
	return result
}

function countPlexes(nodes, edges, plexes) {
	result = Array.apply(null, Array(plexes.length)).map(Number.prototype.valueOf,0);
	res = []
	for (j = 0; j < plexes.length; j++) {
		res.push([])
	}
	for (edge in edges) {
		for (i = 0; i < plexes.length; i++) {
			if (plexes[i].includes(edges[edge].source.toString()) > 0 && plexes[i].includes(edges[edge].target.toString()) > 0) {
				result[i] += 1;
				res[i].push({source:edges[edge].source.toString(), target:edges[edge].target.toString()})
			}
		}
	}
	return [result, res]

}

function create_single_plexes(plex){
		var graphSvg = d3.select("#graphContainer")//.attr("transform","scale(1.5)");

		graphSvg.attr("width", width).attr("height", height)

		plexLength = plexes[plex].length

		console.log(plexes[plex])

		var xRangeMin = parseInt(width/8.)
		var xRangeMax = parseInt(width - xRangeMin)

		var yRangeMin = parseInt(height/8.)
		var yRangeMax = parseInt(height - yRangeMin)

		var innerWidth = xRangeMax - xRangeMin
		var innerHeight = yRangeMax - yRangeMin

	    if(plexLength < 10){
	      coordX = innerWidth/20.
	      coordY = innerHeight/20.
	    }
	    else{
	      coordX = innerWidth/plexLength
	      coordY = innerHeight/plexLength
	    }

	    strokeEdge = coordY/8.
	    strokeNode = coordY/6.
	    nodeRadius = coordY/1.2
	    fontSize = coordY/1.6

		var x_coordinates = []
		for(var i = xRangeMin; i < xRangeMax; i += coordX){
			x_coordinates.push(i)
		}

		var y_coordinates = []
		for (var i = yRangeMin; i < yRangeMax; i += coordY) {
			y_coordinates.push(i)
		}
		
		if(x_coordinates.length > plexLength){
			x_coordinates.splice(x_coordinates.length-1,1)
		}
		if(y_coordinates.length > plexLength){
			y_coordinates.splice(y_coordinates.length-1,1)
		}

		var edgeGroup = graphSvg.append("g")
									.attr("id", "edges");
		var nodeGroup = graphSvg.append("g")
									.attr("id", "nodes");

		var missingGroup = graphSvg.append("g").attr("id","missingEdgesGroup")

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

		var datatemp = []
		missingEdges = findMissingEdges2(isClique, edgesInPlexes, plexes)
			    var dataMissEdges = missingEdges[plex]

		

		for(k in dataMissEdges){ 
			targets = dataMissEdges[k]["edges"]
			if (targets.length > 0) {
				for (i = 0; i < dataMissEdges[k]["edges"].length; i++) {
					edgeToCompare = {"source":dataMissEdges[k]["edges"][i], "target":dataMissEdges[k]["id"]}
					datatemp.push({
						"source": dataMissEdges[k]["id"],
						"target": dataMissEdges[k]["edges"][i]
					})
				}
			}
		}


		
		//remove duplicate edges
		for (i = 0; i < datatemp.length; i++) {
		    temp = datatemp[i]
		    obj = {source:temp.target, target:temp.source}
		    index = datatemp.findIndex(i => i.source === obj.source && i.target === obj.target);
		    
		    if (index > 0) {
		    	datatemp.splice(index, 1)
		    }
		}
		

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
            							.on("mouseover", nodeMouseOver)
										.on("mouseout", nodeMouseOut);

            	circleNode.append("circle")
            				.attr("id", d)
            				.attr("cx", cx)
							.attr("cy", cy)
							.attr("r", function(){if(nodeRadius<1.){ return 1 }else{return nodeRadius}})
							.attr("fill", "#6c84ed")
							.attr("stroke", "white")
							.attr("stroke-width", .1)
							
            	
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

		nodeGroup.moveToFront();
		

		edge.attr("d", function(d){

			//coordinate punto sorgente
			x1 = d3.select("g[id='"+d.source+"']").select("circle").attr("cx")
			y1 = d3.select("g[id='"+d.source+"']").select("circle").attr("cy")

			//coordinate punto target
			x2 = d3.select("g[id='"+d.target+"']").select("circle").attr("cx")
			y2 = d3.select("g[id='"+d.target+"']").select("circle").attr("cy")

			

			lineGenerator = d3.line()
			line = lineGenerator([[x1,y1],[x1,y2],[x2,y2]]);
				
			return line

			}).attr("missing", false);

		
		if(isClique[plex] != true){

			edgeMiss = missingGroup.selectAll("path")
					.data(datatemp)
					.enter()
					.append("path")
					.attr("id", function(d){
							return d.source + "-"+d.target
					})
					.attr("source", function(d){return d.source})
					.attr("target", function(d){return d.target})
					.attr("stroke", "none")
					.attr("stroke-dasharray", 5.5)
					.attr("stroke-width", 0)
					.attr("fill", "transparent")
					.attr("missing", true);

			edgeMiss.attr("d", function(d){
				//coordinate punto sorgente
				 x1 = d3.select("g[id='"+d.source+"']").select("circle").attr("cx")
				 y1 = d3.select("g[id='"+d.source+"']").select("circle").attr("cy")

				//coordinate punto target
				 x2 = d3.select("g[id='"+d.target+"']").select("circle").attr("cx")
				 y2 = d3.select("g[id='"+d.target+"']").select("circle").attr("cy")

				

				lineGenerator = d3.line()
				line = lineGenerator([[x1,y1],[x1,y2],[x2,y2]]);
					
				return line

				});


		}

}

function nodeMouseOver(){
	d3.select(this).select("circle").attr("r", nodeRadius*3)
    d3.select(this).select("text").attr("font-size", parseInt(fontSize*2.6) + "px")

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

function nodeMouseOut(){
	d3.select(this).select("circle").attr("r", nodeRadius)
    d3.select(this).select("text").attr("font-size", parseInt(fontSize) + "px")

    var node = d3.selectAll("circle")
	node.attr("stroke-width", 0)
	.attr("stroke", "none");

	links = d3.select("g#edges").selectAll("path").attr("stroke", "#dbdde6")
				.attr("stroke-width", strokeEdge)
			
}

function topFunction() {
    document.body.scrollTop = 0;  
    document.documentElement.scrollTop = 0; 
}

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("goTopButton").style.display = "block";
    } else {
        document.getElementById("goTopButton").style.display = "none";
    }
}


