import json
import sys

def convert():

	nameFile = "../dataset/geom.nde";

	inputFile = open(nameFile, "r"); 
	outputFile = open("output.json", "w");

	data = inputFile.readlines()
	nodeNumber = int(data[0])
	data = data[nodeNumber:]
	items = []
	for item in data:
	  	items.append(item.replace("\n",""))

	edges = items
	nodes = []
	for n in range(1,int(nodeNumber+1)):
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

	print(finalData)
	with open("output.json", "w") as outputFile:
	  json.dump(finalData, outputFile, indent=4)

convert()
