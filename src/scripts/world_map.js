// import { select, json } from 'd3';
// import { getMetadata } from "core-js/fn/reflect";
// import { parseFloat } from "core-js/core/number";
import * as d3 from "d3";
// import { feature } from "topojson";

class WorldMap {
    constructor() {

        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.data = this.getWorldHappinessData(); // rename: scoreByName
        this.countryNames = this.getCountryNamesData(); // rename: nameById
        this.createMap();
    }

    getWorldHappinessData() {
        const parsedData = {};
        d3.csv("https://raw.githubusercontent.com/rebeccamrfoster/javascript_project_dataset/main/world-happiness-report-2021.csv")
            .then(data => {
                data.forEach(country => {
                    const countryName = country["Country name"];
                    const ladderScore = parseFloat(country["Ladder score"]);
                    parsedData[countryName] = ladderScore;
                });
            });
        return parsedData;

        // async function getData() {
        //     const response = await fetch("https://raw.githubusercontent.com/rebeccamrfoster/javascript_project_dataset/main/world-happiness-report-2021.csv");
        //     const text = await response.text();
        //     const data = d3.csvParse(text);
        //     console.log(data);
        //     return data;
        // }
    }

    createMap() {
        const width = 900;
        const height = 600;

        const svg = d3.select("div")
            .append("svg")
            .attr("height", height)
            .attr("width", width);

        // convert latitude/longitude coordinates to flat Cartesian plane
        const projection = d3.geoMercator()
            .scale(140)
            .translate([width / 2, height / 1.4]); // translate to center of SVG

        // let projection = function(longLat) {
        //     return d3.geoMercator(longLat);
        // }
        const pathGenerator = d3.geoPath().projection(projection);

        let colorScale = d3.scaleSequential()
            .domain([0, 10])
            .interpolator(d3.interpolatePlasma);

        // const colorLegend = svg.append('g')
        //     .attr("transform", "translate(180, 150)")
        //     .call(colorLegend, {
        //         colorScale,
        //         circleRadius: 30,
        //         spacing: 80,
        //         textOffset: 40
        //     });

        // returns promise
        d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json")
            .then(data => {
                // convert TopoJSON to GeoJSON in memory, e.g., topojson.feature(topology, object)
                const countries = topojson.feature(data, data.objects.countries);

                // data join -- make one SVG path element for each country/piece of data                
                svg.selectAll("path")
                    .data(countries.features)
                    .join("path")
                    .attr("fill", "#cccccc")
                    .attr("d", d => pathGenerator(d)) // function takes one feature as argument, uses pathGenerator
                    .attr("id", d => {
                        return `${d.id}`;
                    })
                    .attr("fill", d => {
                        const countryName = this.countryNames[parseInt(d.id)];
                        if (this.data[countryName]) {
                            return colorScale(this.data[countryName]);
                        }
                        else {
                            return "#cccccc";
                        }
                    });

                    document.querySelectorAll("path").forEach(el => {
                    el.addEventListener("mouseover", this.handleMouseOver);
                    el.addEventListener("mouseout", this.handleMouseOut);
                });
            });
    }

    getCountryNamesData() {
        const parsedData = {};
        d3.tsv("https://raw.githubusercontent.com/KoGor/Map-Icons-Generator/master/data/world-110m-country-names.tsv")
            .then(data => {
                data.forEach(country => {
                    if (country.name === "Russian Federation") country.name = "Russia";
                    if (country.name === "Bolivia, Plurinational State of") country.name = "Bolivia";
                    if (country.name === "Venezuela, Bolivarian Republic of") country.name = "Venezuela";
                    if (country.name === "Tanzania, United Republic of") country.name = "Tanzania";
                    if (country.name === "Iran, Islamic Republic of") country.name = "Iran";
                    if (country.name === "Viet Nam") country.name = "Vietnam";
                    if (country.name === "Korea, Republic of") country.name = "South Korea";
                    parsedData[parseInt(country.id)] = country.name;
                })
            });
        return parsedData;
    }

    handleMouseOver(event) {
        const target = event.target;

        // target.setAttribute("style", "fill: #a70c70;");
        // target.setAttribute("style", "opacity: 40%;");
        const countryName = this.countryNames[parseInt(target.id)];
        const h1 = document.querySelector("h1");
        h1.innerText = countryName;
        const ul = document.querySelector("ul");
        const li = document.querySelector("li");
        const ladderScore = this.data[countryName];
        li.textContent = `Ladder score: ${ladderScore}`;
       
        // target.setAttribute("style", "opacity: 50%;")

        // const colorScale = scaleOrdinal(schemeCategory10);
        // const colorValue = this.data[name];
        // colorScale.domain([0, 10]);
    }

    handleMouseOut(event) {
        const target = event.target;
        target.setAttribute("style", "fill: #cccccc;")
        target.setAttribute("style", "opacity: 100%;")
    }

}

export default WorldMap;