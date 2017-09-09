canvasWidth = (screen.width)/100*98
canvasHeight = (screen.height)/100*65

var baseCanvas = d3.select("body")
					.append("svg")
					.attr("id","canvas")
					.attr("width", canvasWidth)
					.attr("height", canvasHeight)
					.attr("border",1);

var canvasBorder = baseCanvas.append("rect")
                            .attr("id","rect")
       			.attr("x", 0)
       			.attr("y", 0)
       			.attr("height", canvasHeight)
       			.attr("width", canvasWidth)
       			.style("stroke", 'black')
       			.style("fill", "none")
       			.style("stroke-width", 1);

var width = baseCanvas.attr("width");
var height = baseCanvas.attr("height");
var color = d3.scaleOrdinal(d3.schemeCategory10);

var simulation = d3.forceSimulation()
        .force("forceX", d3.forceX().strength(.1).x(width * .5))
        .force("forceY", d3.forceY().strength(.1).y(height * .5))
        .force("center", d3.forceCenter().x(width * .5).y(height * .5))
        .force("charge", d3.forceManyBody().strength(-15));

d3.text("2-plexes/cluster_output_s838_st_2_3.csv", function(error, data){
       if(error) throw error;
       plexes = d3.csvParseRows(data);
       datax = data.split("\n");
       var nodeGroup = baseCanvas.append("g")
                                          .attr("id", "nodes");

       //sorting plexes in desc order 
       plexes.sort(function(a, b){
         return b.length - a.length;
       });

       biggestPlexLength = plexes[0].length;

       var biggestPlex = nodeGroup
                            .append("circle")
                            .attr("class", "n0")
                            .attr("cx", width/2)
                            .attr("cy", height/2)
                            .attr("r", biggestPlexLength)
                            .style("fill", function() { return color(biggestPlexLength);})

       nodeGroup.append("text")
              .attr("class", "n0")
              .attr("x", biggestPlex.attr("cx"))
              .attr("y", biggestPlex.attr("cy"))
              .attr("text-anchor", "middle")
              .style("font-size", biggestPlex.attr("r")/2)  
              .text(biggestPlexLength.toString());

       biggestPlex.on("click", expandNode);
                            
       function expandNode() {
              console.log("ciaone")
              d3.select("body").selectAll(".n0").remove();
              
              var nodes = nodeGroup.selectAll("circle")
                     .data(plexes)
                     .enter()
                     .append("circle")
                     .attr("r", function (d) { return d.length})
                     .style("fill", function(d, i) { return color(i);})
                     .call(d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended));

              function dragstarted(d) {
                     if (!d3.event.active) simulation.alphaTarget(.03).restart();
                     d.fx = d.x;
                     d.fy = d.y;
              }

              function dragged(d) {
                     d.fx = d3.event.x;
                     d.fy = d3.event.y;
              }

              function dragended(d) {
                     if (!d3.event.active) simulation.alphaTarget(.03);
                     d.fx = null;
                     d.fy = null;
              }


       nodePadding = 2.5;
       

        simulation
          .nodes(plexes)
          .force("collide", d3.forceCollide().strength(.5).radius(function(d){ return d.radius + nodePadding; }).iterations(1))
          .on("tick", function(d){
            nodes
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
          });
}

/*
var circles = nodeGroup.selectAll("circle")
                     .data(plexes)
                     .enter()
                     .append("circle")
                     .attr("cx", function (d) { return d.length*10; })
                     .attr("cy", function (d) { return d.length*10; })
                     .attr("r", function (d) { return d.length})
                     .style("fill", function(d) { return color(d.length);})
*/
});
