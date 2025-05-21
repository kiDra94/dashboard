function printHeader() {
    let html = "<thead>";
    html += "<tr>";
    html += "<th scope='col'>Zeit</th>";
    html += "<th scope='col'>Preis</th>";
    html += "<th scope='col'>Einheit</th>";
    html += "</tr>";
    html += "</thead >";
    return html;
}
function printRow(priceObj) {
    let html = "<tr>";
    html += "<td>" +
        new Date(priceObj.start_timestamp).toLocaleTimeString()
        + "</td>";
    html += "<td>" + priceObj.marketprice + "</td>";
    html += "<td>" + priceObj.unit + "</td>";
    html += "</tr >";
    return html;
}
function setContent(id) {
    let contents = document.querySelectorAll(".content");
    let links = document.querySelectorAll(".nav-link");

    for (let i = 0; i < contents.length; i++) {
        let ele = contents[i];
        ele.classList.add("d-none");
    };
    $("#" + id + "-content").removeClass("d-none");


    if (id == "fetch") {
        let url = "https://api.awattar.at/v1/marketdata?";
        url += "start=" + $("#from").val(); //$("#[name]") -> id
        url += "&end=" + $("#to").val();
        $.get(url).then((resp) => {

            let prices = resp.data;
            console.log(myData);
            myData["series"] = []; // erzeugt einen neue property
            console.log(myData);
            let chartline = {};
            chartline["name"] = "EPEX-Spot-Preice"; // erzeugt eine NEUSES property name in chartline
            let dataPoints = [];
            chartline["data"] = dataPoints;
            chartline.fillOpacity = 0.1;

            prices.forEach((price) => {
                // p[0] = price.start_timestamp; // [x-Wert] Zeitachse
                // p[1] = price.marketprice; // [y-Wert] Preis
                dataPoints.push([price.start_timestamp, price.marketprice]);
            }
            );
            myData.series.push(chartline);
            Highcharts.chart("mychart", myData);
            writeTable();
        });
    }

}

function writeTable() {
    let url = "https://api.awattar.at/v1/marketdata";
    $.get(url).then((resp) => {

        let prices = resp.data;
        console.log(prices);
        let html = printHeader();
        html += "<tbody>";
        prices.forEach(price => {
            html += printRow(price);

        });
        html += "</tbody>";
        $("#mytable").append(html);

    });
    console.log("Achtung: dieser Code steht ach dem $.get wird aber vor .then ausgefuert")
}
$(document).ready(() => { // document (dom) ready!
    // setContent("fetch");
    $("#fetch-link").click(() => { setContent('fetch') });//registering
    $("#about-link").click(() => { setContent('about') });
    $("#redraw").click(() => {
        setContent("fetch");
    }
    )

});

let myData = {
    chart: {
        type: 'area',
        zooming: {
            type: "x"
        }
    },
    title: {
        text: 'Strompreise von EPEX-Spot'
    },
    subtitle: {
        text: 'we are now better'
    },
    xAxis: {
        type: 'datetime' // In ms [epochalzeot]
    },
    yAxis: {
        title: {
            text: 'Preis (€/MWh)'
        }
    },
    navigator: {
        enabled: true, // Enable the navigator
        series: {
            type: 'line', // Customize the series type
            color: '#FF0000' // Customize the color
        }
    }
}