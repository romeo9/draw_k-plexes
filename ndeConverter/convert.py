import json
"""This module will take the input.nde file with format similar to 
http://patrignani.dia.uniroma3.it/large-k-plexes/example.nde
and will write an output.json file describing graph's nodes and edges"""
inputFile = open("input.nde", "r"); 
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
  nodeLabels.append({"id":str(n)})

edgeLabels = []
for e in edges:
  strings = e.split(" ")
  edgeLabels.append({"source": strings[0], "target": strings[1]})

print(edgeLabels)
print(nodeLabels)

finalData = {
  "nodes": nodeLabels,
  "links": edgeLabels
}

with open("output.json", "w") as outputFile:
  json.dump(finalData, outputFile, indent=2)

