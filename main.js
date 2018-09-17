var URL = "https://gtbuses.herokuapp.com/predictions/";
var numberTimes = 2;
class Stop {
    constructor(name, tms) {
        this.name = name;
        this.stopTimes = tms;
    }
}

class Route {
    constructor(routeName, sts) {
        this.routeName = routeName;
        this.routeStops = sts;
    }
    
    updateRoute() {
        var xmlDocument = requestXML(this);
        var locations = xmlDocument.getElementsByTagName("predictions");
        var times = xmlDocument.getElementsByTagName("direction");
        var stopsList = [];
        for (var j = 0; j < locations.length; j++) {
            if (times.length == 0) {
                var temp = [-2];
                stopsList.push(new Stop(locations[j].getAttribute("stopTitle"), temp));
            } else {
                var preds = times[j].getElementsByTagName("prediction");
                var tmAr = [];
                for (var k = 0; k < preds.length; k++) {
                    tmAr.push(preds[k].getAttribute("minutes"));
                }
                stopsList.push(new Stop(locations[j].getAttribute("stopTitle"), tmAr));
            }
        }
        this.routeStops = stopsList;
    }
}

var dummyStops = [new Stop("test", 0), new Stop("test2", 0)];
var mainRoutes = [new Route("Red", dummyStops), new Route("Blue", dummyStops), new Route("Trolley", dummyStops), new Route("Night", dummyStops)];
var currentRoute = mainRoutes[0];

function requestXML(whichRoute) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", URL + whichRoute.routeName.toLowerCase(), false);
    xhr.setRequestHeader('Content-Type', 'text/xml');
    xhr.send();
    return xhr.responseXML;
}

function makeTable(aRoute) {
    var table = document.createElement("table");
    var tBody = document.createElement("tbody");
    table.setAttribute("class", "table");
    table.setAttribute("class", "table-hover");
    //each row of table
    for (var i = 0; i < aRoute.routeStops.length; i++) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        var strTD = aRoute.routeStops[i].name + ": ";
        if (aRoute.routeStops[i].stopTimes[0] == -2) {
            strTD += " No data";
        } else {
            for (var j = 0; j < aRoute.routeStops[i].stopTimes.length; j++) {
                strTD += aRoute.routeStops[i].stopTimes[j];
                if (j + 1 < aRoute.routeStops[i].stopTimes.length) {
                    strTD += ", ";
                }
            }
            strTD += " mins";
        }
        td.innerHTML = strTD;
        tr.appendChild(td);
        tBody.appendChild(tr);
    }
    table.appendChild(tBody);
    table.style.width = "100%";
    var myDiv = document.getElementById("myDiv");
    while (myDiv.hasChildNodes()) {
        myDiv.removeChild(myDiv.lastChild);
    }
    console.log("Shoud be 0:"  + myDiv.childElementCount);
    myDiv.appendChild(table);
    console.log(myDiv.childElementCount);
}

function refresh(e) {
    if (e.target.id == "red") {
        currentRoute = mainRoutes[0];
    } else if (e.target.id == "blue") {
        currentRoute = mainRoutes[1];
    } else if (e.target.id == "trolley") {
        currentRoute = mainRoutes[2];
    } else if (e.target.id == "night") {
        currentRoute = mainRoutes[3];
    } else {
        currentRoute = mainRoutes[0];
    }
    
    for (var i = 0; i < mainRoutes.length; i++) {
        mainRoutes[i].updateRoute();
        console.log(mainRoutes[i]);
    }
    makeTable(currentRoute);
}

document.getElementById("red").addEventListener("click", refresh);
document.getElementById("blue").addEventListener("click", refresh);
document.getElementById("trolley").addEventListener("click", refresh);
document.getElementById("night").addEventListener("click", refresh);