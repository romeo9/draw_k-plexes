canvasWidth = (screen.width)/100*98
canvasHeight = (screen.height)/100*65

var baseCanvas = d3.select("body")
					.append("svg")
					.attr("id","canvas")
					.attr("width", canvasWidth)
					.attr("height", canvasHeight)
					.attr("border",1)

var canvasBorder = baseCanvas.append("rect")
       			.attr("x", 0)
       			.attr("y", 0)
       			.attr("height", canvasHeight)
       			.attr("width", canvasWidth)
       			.style("stroke", 'black')
       			.style("fill", "none")
       			.style("stroke-width", 1);

var width = baseCanvas.attr("width");
var height = baseCanvas.attr("height");