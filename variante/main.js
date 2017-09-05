
function showDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

//Variabili globali. 
//Il nome del dataset viene aggiornato quando si clicca sul tasto "Select dataset.."
//e viene aggiornato nel metodo .onclick
//Dopo che viene aggiornato rimane aggiornato fino al successivo click
var datasetName, nodes, edges, isClique, plexes, width, height, plex2numbers = [];
var numberOfKplexes, numberOfCliques;
var maxNumberNodes = 24000;
var maxNumberEdges = 140000;
var color = d3.scaleOrdinal(d3.schemeCategory20c)

width = screen.width*.95;
height = screen.height*.65;

//Gestisce l'evento click sulla schermata
var dropMenu = document.getElementById("myDropdown");

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
}

function create_plex2numbers(){
	plex2numbers = []
    var curr;

    for (var i = 0; i < plexes.length; i++) {
    	if(curr != plexes[i].length){
	    	var singleObject = {
	    		"id": plexes[i].length,
	    		"cliques": 0,
	    		"kplex": 0
	    	}
	    	plex2numbers.push(singleObject)
	    }
    	curr = plexes[i].length
    	
    }

    for (var i = 0; i < plexes.length; i++) {
    	var countCliques = 0;
    	var countKplex = 0;
    	if(isClique[i] == true) countCliques++;
    	if(isClique[i] == false) countKplex++;

    	for(var j=0; j<plex2numbers.length; j++){
    		if(plexes[i].length == plex2numbers[j].id){
    			plex2numbers[j].cliques += countCliques;
    			plex2numbers[j].kplex += countKplex;
    		}
		}
    }
    
}	

function set_values() {

    drawStackedGraph(nodes, edges, plexes);
    numberOfCliques = countInArray(isClique, true)
    create_plex2numbers();
    console.log(plexes)
    console.log(isClique)
    console.log(plex2numbers)
    
    
    
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
	var svg = d3.select("svg");
	
	svg.attr("width", width).attr("height", height)

	var color = d3.scaleOrdinal(d3.schemeCategory20c)

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

   var pie_group = svg.append("g").attr("id", "pie_group")
    .attr("transform", "translate(" + width / 4. + "," + height / 4. + ") scale(.5)");

    var data = [nodes.length, numberOfKplexes, edges.length ]

    var g = pie_group.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data); });

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
  var svg = d3.select("svg");
  var margin = 30;

  var bar_chart = svg.append("g").attr("id", "bar_chart")
                    .attr("transform", "translate("+ width/8.*5 +","+ 0 +") scale(.6)");
  

  data = plex2numbers.reverse()

  var x = d3.scaleBand().range([0,width-(width/2.)]);
  var y = d3.scaleLinear().range([height,0]);

  var valueline = d3.line()
    .x(data.length)
    .y(plexes.length);

  bar_chart.append("g")
    .attr("transform",
          "translate(" + width/2. + "," + height/2. + ") scale(0.1)");

  var maximum = d3.max(data.map(function(d){ return d.cliques+d.kplex; }))
  x.domain(data.map(function(d){ return d.id; })).paddingInner([0.1])
	    .paddingOuter([0.3])
	    .align([0.5]);
  y.domain([0, maximum]);

  bar_chart.append("path")
      .data(data.length)
      .attr("class", "line")
      .attr("d", valueline);

  bar_chart.selectAll("dot")
      .data(data)
      .enter().append("rect")
      .attr("isClique", true)
      .attr("x", function(d){return x(d.id)})
      .attr("y", function(d){return y(d.cliques+d.kplex);} )
      .attr("width", x.bandwidth())
      .attr("height", function(d){ var temp = d.cliques+d.kplex; return height-y(temp);})
      .style("fill", function(d){return color(d.id)})
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

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
      .attr("transform", "translate(0,0)")
      .call(d3.axisLeft(y))
      .append("text").text("Numero Archi");

}

function handleMouseOver(d) {  
      radius = 20;
      d3.select(this).style("fill", "orange");
      var x = d3.select(this).attr("x");
      var y = d3.select(this).attr("y");
      var str = nodes.length+","+edges.length;

      d3.select("#bar_chart").append("text")
            .attr("id","info")
            .attr("x",x)
            .attr("y",y)
            .text(str);
}

function handleMouseOut(d) {
    //var color = d3.scaleOrdinal(d3.schemeCategory20c)
    d3.select(this).style("fill", color(d.id))
    d3.select("#info").remove();  
}

function remove_all(){
	d3.select("svg").selectAll("g").remove();
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
	
	//console.log(isClique)
	//console.log(numberOfCliques)
	edgesInPlexes = findEdges(isClique, plexes, plexesEdges)
	missingEdges = findMissingEdges(isClique, edgesInPlexes, plexes)
	
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
			//if (edges[edge].source in plexes[i] && edges[edge].target in plexes[i]) {
			if (plexes[i].includes(edges[edge].source.toString()) > 0 && plexes[i].includes(edges[edge].target.toString()) > 0) {
				result[i] += 1;
				res[i].push({source:edges[edge].source.toString(), target:edges[edge].target.toString()})
			}
		}
	}
	return [result, res]

}

