import json

inputFile = open("/Users/claudiaromeo/Documents/Universita/BigData/SecondoProj/experiments/jazz.nde", "r"); 
outputFile = open("output.json", "rw");

data = inputFile.readlines()

items = []
for item in data:
  if not (item == "\n"):
    items.append(item[:-1])



edges = items[1:]
nodes = []
for n in range(0,int(items[0])+1):
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

