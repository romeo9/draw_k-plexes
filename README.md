# Progetto Infovis
## Draw k-plexes Tool

Questo progetto ha l'obiettivo di rappresentare in modo esaustivo i risultati ottenuti eseguendo l'algoritmo per il calcolo dei k-plessi, più specificatamente, per il calcolo dei 2-plessi con numero di nodi almeno pari all'80% della cricca massima. 
Per fare ciò, abbiamo tentato di visualizzare al meglio dati molto eterogenei tra di loro, considerando l'esecuzione dell'algoritmo su 6 diversi dataset. Questi ultimi differiscono tra loro per il numero di nodi, che può variare da poche centinaia a circa 12 mila, e per il numero degli archi, che può variare indipendentemente dal numero di nodi del grafo.

## Esecuzione
Cliccare sul link sottostante:

https://romeo9.github.io/draw_k-plexes

## Utilizzo
Dal menu a tendina si possono scegliere i vari dataset. Per ogni dataset viene mostrato un radar chart, che rappresenta la proporzione che c'è tra il numero di nodi del grafo, il numero di archi e il numero di k-plessi ottenuti dall'algoritmo.

Accanto viene mostrato un grafico a barre con la distribuzione dei k-plessi, sull'asse x infatti sono raggruppati per numero di nodi del singolo k-plesso, sull'asse y è rappresentata la quantità di k-plessi. Il numero di k-plessi che viene mostrato, è il numero totale di k-plessi ottenuti, il quale include anche il numero delle cricche. Nel grafico a barre quindi, l'asse y rappresenta il numero totale di k-plessi, mentre i colori stanno a diversificare il tipo di plesso ottenuto: se è un k-plesso, oppure una cricca.

Se si clicca su una cricca o un k-plesso del grafico a barre, sotto si potrà vedere il grafo disegnato con la tecnica degli L-drawings. Se il grafo è un k-plesso, verrà mostrata anche la checkbox che permette di mostrare gli archi mancanti. Nel caso sia stata selezionata una cricca, la checkbox non comparirà. Inoltre, è presente un bottone per tornare in cima nella pagina.

