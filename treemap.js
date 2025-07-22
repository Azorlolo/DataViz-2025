let ParPays = {
    
    series: [
        {
            data: [],
        }
    ],
    colors: [
        '#2d2c7c'
    ],
    plotOptions: {
        treemap: {
            distributed: true,
            enableShades: true
        }
    },
    dataLabels: {
        style: {
            colors: ['#ffeba7']
        }
    },
    xaxis: {
        type: 'category'
    },
    legend: {
        show: false
    },
    chart: {
        height: 350,
        type: 'treemap',
        events: {
            click: function(event, chartContext, config) {
                //console.log(event);
                if (event["target"]["parentNode"]["attributes"]["data:realIndex"]) { // pour gérer les cas ou les clics ne sont pas au bon endroit
                    if (typeof config.dataPointIndex !== 'undefined' && config.dataPointIndex !== -1) {
                        let index = config.dataPointIndex;
                        let SelectionPays = ParPays.series[0].data[index].x;
                        console.log(SelectionPays);
                        constructeurGraph2(SelectionPays);
                    }
                }
            }
        },
    },
    title: {
        text: '',
    }
};

var colors = [
    '#2d2c7c',
    '#7372A6',
]

var ProportionGenre = {
    series: [{
        data: [],
        hiiden: [false, false]
    }],
    chart: {
        height: 350,
        type: 'bar',
        events: {
            click: function(chart, w, e) {
                // console.log(chart, w, e)
            }
        }
    },
    colors: colors,
    plotOptions: {
        bar: {
            columnWidth: '45%',
            distributed: true,
        }
    },
    dataLabels: {
        enabled: true,
        style: {
            colors: ['#fff']
        },
        formatter: (val) => {
            return val + '%'
        }
    },
    legend: {
        show: false
    },
    xaxis: {
        categories: [
            ['Femme'],
            ['Homme'],
        ],
        labels: {
            style: {
                colors: colors,
                fontSize: '12px'
            }
        }
    },
    yaxis: {
        labels: {
            formatter: (val) => {
                return val + '%'
            }
        }
    },
    title: {
        text: '',
    }
};

// Fait une liste de tout les nom de pays
const dedoublonne = bac.reduce((acc, element) => {
    if (!acc.includes(element["Pays et territoires insulaires du Pacifique"])) {
        acc.push(element["Pays et territoires insulaires du Pacifique"]);
    }
    return acc;
}, []);
//console.log("Données : Liste de touts les pays présents dans la base de données");
//console.log(dedoublonne);


// Fait une liste de toute les années
const dedoublonneAnnee = bac.reduce((acc, element) => {
    if (!acc.includes(element["TIME_PERIOD"])) {
        acc.push(element["TIME_PERIOD"]);
    }
    return acc;
}, []);
//console.log("Données : Liste de toutes les années présentes dans la base de données");
//console.log(dedoublonneAnnee);


// Renvoie l'année la plus récente
function AnneeRecente(){
    annee = 0;
    for (let i = 0; i < dedoublonneAnnee.length; i++) {
        if (annee < dedoublonneAnnee[i]) {
            annee = dedoublonneAnnee[i];
        }
    }
    return annee;
}
AnneeRecente();
//console.log("Données : L'année la plus récente");
//console.log(AnneeRecente());


// Récolte les données pour le treemap en fonction de l'année
function Donnees(acc, element){ 
    if (element["TIME_PERIOD"] == annee){
        acc.push(element["OBS_VALUE"]);
    }
    return acc;
}
const donnee = bac.reduce(Donnees, []);


// Récolte les nom de pays pour le treemap en fonction de l'année
function DonneePays(acc, element){
    if (element["TIME_PERIOD"] == annee){
        acc.push(element["Pays et territoires insulaires du Pacifique"]);
    }
    return acc;
}
const donneePays = bac.reduce(DonneePays, []);
//console.log("Données : Liste Pays Selon l'année");
//console.log(donneePays);


// Proportion des femmes en fonction de l'année et du pays sélectionné
function proportionFemme(acc, element, SelectionPays){
    if (typeof acc === 'undefined') acc = [];
    if (element["TIME_PERIOD"] == annee){
        if (element["Pays et territoires insulaires du Pacifique"] == SelectionPays){
            if (element["Indicateur"] == "Taux d'achèvement, deuxième cycle du secondaire, femmes (%)") {
                acc.push(element["OBS_VALUE"]);
            }
        }
    }
    return acc;
}
// Proportion des hommes en fonction de l'année et du pays sélectionné
function proportionHomme(acc, element, SelectionPays){
    if (typeof acc === 'undefined') acc = [];
    if (element["TIME_PERIOD"] == annee){
        if (element["Pays et territoires insulaires du Pacifique"] == SelectionPays){
            if (element["Indicateur"] == "Taux d'achèvement, deuxième cycle du secondaire, garçons (%)") {
                acc.push(element["OBS_VALUE"]);
            }
        }
    }
    return acc;
}

//Renvoie une liste de toute les données en forme pour le treemap
function listeTreemap(DataPays, DataPercentage){
    liste = [];
    for (let i = 0; i < DataPays.length; i++) {
        liste.push({x: DataPays[i], y: DataPercentage[i]});
    }
    return liste;
}
//console.log("Données : Données misent en forme pour le treemap");
//console.table(listeTreemap(donneePays, donnee));
ParPays["series"][0]['data'] = listeTreemap(donneePays, donnee);

function listeBar(DataFemme, DataHomme){
    liste = [];
    for (let i = 0; i < DataFemme.length; i++) {
        liste.push(DataFemme[i], DataHomme[i]);
        
    }
    return liste;
}

//Compteur de décennie pour le bouton
function compteurDec(accumulateur, elt) {
    let decenie = Math.trunc(elt["TIME_PERIOD"] / 10);
    //console.log(elt["TIME_PERIOD"] +" -> "+ decenie);
    
    if (!accumulateur[decenie]) accumulateur[decenie] = [];
    
    if (!accumulateur[decenie].find((valeur) => valeur == elt["TIME_PERIOD"]))
        accumulateur[decenie].push(elt["TIME_PERIOD"]);
    
    return accumulateur;
}
//console.log(bac.reduce(compteurDec, []));


// Génère un dropdown avec des dropright par décennie à partir de compteurDec
function constructeurBouton() {
    const decennies = bac.reduce(compteurDec, []);
    const idContent = document.getElementById("content");
    idContent.innerHTML = "";
    for (let dec = 0; dec < decennies.length; dec++) {
        if (!decennies[dec] || decennies[dec].length === 0) continue;
        idContent.innerHTML += 
        `
        <div class="dropright">
            <button>
                <span>${dec}0</span>
                <span>▸</span>
            </button>
            <div class="dropright-content">
                ${decennies[dec].map(annee => `<button id="${annee}" value="${annee}" onclick="change(this.id)">${annee}</button>`).join('')}
            </div>
        </div>
        `;
    }
}
constructeurBouton();

//On change le treemap en fonction de l'année choisie
function change(id_bouton){
    document.getElementById('graph1').innerHTML = "";
    document.getElementById('graph2').innerHTML = "";
    //console.log("Tout casser");
    
    annee = document.getElementById(id_bouton).value;
    // Change le titre du treemap
    ParPays["title"]['text'] = "Taux d'achèvement, deuxième cycle du secondaire, par pays - " + annee;
    
    const Changedonnee = bac.reduce(Donnees, []);
    const ChangedonneePays = bac.reduce(DonneePays, []);
    
    // Utilise la fonction pour construire le treemap dans une liste
    listeTreemap(ChangedonneePays, Changedonnee);
    //met la liste dans le treemap
    ParPays["series"][0]['data'] = listeTreemap(ChangedonneePays, Changedonnee);
    
    //console.log("Données : Données misent en forme pour le treemap");
    //console.table(listeTreemap(ChangedonneePays, Changedonnee));
    let graph1 = new ApexCharts(document.querySelector("#graph1"), ParPays);
    graph1.render();
};

// Créer le titre du treemap ParPays
ParPays["title"]['text'] = "Taux d'achèvement, deuxième cycle du secondaire, par pays - " + annee;


// créer la vue des treemaps
let graph1 = new ApexCharts(document.querySelector("#graph1"), ParPays);
graph1.render();
//console.table(ParPays["series"]);

function constructeurGraph2(SelectionPays){
    document.getElementById('graph2').innerHTML = "";
    //console.log("Tout casser");
    // Utilise des fonctions fléchées pour passer SelectionPays à reduce
    const donneeProportionFemme = bacGenre.reduce((acc, element) => proportionFemme(acc, element, SelectionPays), []);
    const donneeProportionHomme = bacGenre.reduce((acc, element) => proportionHomme(acc, element, SelectionPays), []);
    ProportionGenre["series"][0]['data'] = listeBar(donneeProportionFemme, donneeProportionHomme);
    // Créer le titre du treemap ProportionGenre
    ProportionGenre["title"]['text'] = "Taux d'achèvement, deuxième cycle du secondaire, par genre - " + SelectionPays + " - " + annee;
    let graph2 = new ApexCharts(document.querySelector("#graph2"), ProportionGenre);
    graph2.render();
    //console.table(ProportionGenre["series"]);
}


// Anciennes versions

/*/ Récolte les données pour le treemap en fonction de l'année
const donnee = bac.reduce((acc, element) => {
    if (element["TIME_PERIOD"] == annee){
acc.push(element["OBS_VALUE"]);
}
return acc;
}, []);


// Récolte les nom de pays pour le treemap en fonction de l'année
const donneePays = bac.reduce((acc, element) => {
    if (element["TIME_PERIOD"] == annee){
acc.push(element["Pays et territoires insulaires du Pacifique"]);
}
return acc;
}, []);

Créer le bouton pour selectionner l'année
function constructeurBouton(){
id = document.getElementById("Bouton-années")
for (let i = 0; i < dedoublonneAnnee.length; i++) {
if (dedoublonneAnnee[i] == AnneeRecente()) {
id.innerHTML += `<option value="${dedoublonneAnnee[i]}" selected>${dedoublonneAnnee[i]}</option>`;
}
//
else if (dedoublonneAnnee[i].substr(-1) == "0") {
id.innerHTML += `<option value="---" selected>---</option>`;
}
//
else {
id.innerHTML += `<option value="${dedoublonneAnnee[i]}">${dedoublonneAnnee[i]}</option>`;
}

}
}
constructeurBouton();
/*/
