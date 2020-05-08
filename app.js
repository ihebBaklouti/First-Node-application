//import module
const express = require("express");
const bodyParser = require('body-parser');
const https = require('https');

//instance 
const app = express();

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));




app.get("/", function(req, res) {
    /* res.send("Welcome to Crococoder"); */
    console.log("Directory name", __dirname);
    res.sendFile(__dirname + '/index.html');
});

// {"phy"="12","math"="12","info"="12" }
// {"phy"="12"}
// {"math"="12"}
// {"info"="12"}

app.post('/', function(req, res) {
    const physique = Number(req.body.phy);
    const math = Number(req.body.math);
    const informatique = Number(req.body.info);

    console.log("Physique", physique);
    console.log("Math", math);
    console.log("Informatique", informatique);

    const moy = ((physique * 3) + (math * 4) + (informatique * 3)) / 10;
    console.log("La moyenne est ", moy);
    res.send("votre moyenne est égale à " + moy);


});


app.get("/weather", function(req, res) {
    /*  res.send("Welcome to Crococoder"); */
    console.log("Directory name", __dirname);
    res.sendFile(__dirname + "/weather.html");
});

// apiKey : '3cc108c73ae74c06437904c934bb5ac2'
app.post("/weather", function(request, response) {
    const apiKey = '3cc108c73ae74c06437904c934bb5ac2';
    const cityName = request.body.city;
    console.log("this is my city ", cityName);
    /* res.send("ok" + city); */
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=,' + cityName + ',&appid=' + apiKey + '&units=metric'
    console.log('url is', url);

    https.get(url, (res) => {
        console.log(res.statusCode);
        res.on('data', (data) => {
            console.log('this my data', JSON.parse(data));
            weather = JSON.parse(data);
            minTemp = weather.main.temp_min;
            maxTemp = weather.main.temp_max;
            temp = weather.main.temp;
            icon = weather.weather[0].icon;
            var imageSrc = "http://openweathermap.org/img/w/" + icon + ".png";
            response.write("<h1>Min temp </h1>" + minTemp);
            response.write("<h1>Max temp </h1>" + maxTemp);
            response.write("<h1>Temp </h1>" + temp);
            response.write("<img src=" + imageSrc + ">");
            response.send();

        })

    })

});

app.get("/covid19", function(req, response) {
    response.sendFile(__dirname + '/covid-19.html');
});


app.post("/covid19", function(req, response) {
    const cityName = req.body.city;
    var options = {
        "method": "GET",
        "hostname": "covid-19-data.p.rapidapi.com",
        "port": null,
        "path": "/report/country/name?date-format=YYYY-MM-DD&format=json&date=2020-04-01&name=" + cityName,
        "headers": {
            "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
            "x-rapidapi-key": "f1257ec6bamshf7553b9ad8b88d5p16bcfbjsneecaeb493f67"
        }
    };

    var req = https.request(options, function(res) {
        let chunks = [];

        res.on("data", function(chunk) {
            chunks.push(chunk);
        });

        res.on("end", function() {
            let tab = [];
            var body = Buffer.concat(chunks);
            /* console.log(body.toString()); */
            tab = body.toString();
            console.log("My data is ", tab);
            casesConfirmed = tab[0].provinces[0].confirmed;
            console.log("Number of confirmed cases is ", casesConfirmed);
        });
    });



    req.end();

    response.send();
});


//mettre à l'écoute
app.listen(3000, function() {
    console.log("Serveur à l'écoute en PORT 3000")
});