import json
import sys

def convert(inputFileName):
	"""file must be in the form:
		first row: number of nodes
		next rows: links
		last row: empty
	"""
	nameFile = inputFileName;
	outputName = nameFile.split("/")[-1]

	inputFile = open(nameFile, "r"); 
	outputFile = open("output.json", "w");

	data = inputFile.readlines()
	nodeNumber = int(data[0])
	data = data[1:]
	items = []
	for item in data:
	  	items.append(item.replace("\n",""))

	edges = items
	nodes = []
	for n in range(0,int(nodeNumber)):
	  nodes.append(n)

	nodeLabels = []
	for n in nodes:
	  nodeLabels.append({"id":n})

	edgeLabels = []
	for e in edges:
	  strings = e.split(" ")
	  edgeLabels.append({"source": int(strings[0]), "target": int(strings[1])})


	finalData = {
	  "nodes": nodeLabels,
	  "links": edgeLabels
	}

	with open(outputName[:-4] + ".json", "w") as outputFile:
	  json.dump(finalData, outputFile, indent=4)

convert(sys.argv[1])
