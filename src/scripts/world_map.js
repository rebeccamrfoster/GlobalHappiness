import * as d3 from "d3";
import { colorScale, continuous } from "./color_legend";

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
            .then(response => {
                response.forEach(country => {
                    const countryName = country["Country name"];
                    // const ladderScore = parseFloat(country["Ladder score"]);
                    parsedData[countryName] = country;
                });
            });
        return parsedData;
    }

    createMap() {
        const width = 900;
        const height = 600;

        const svg = d3.select("div")
            .append("svg")
            .attr("height", height)
            .attr("width", width);
        const g = svg.append("g");
        
        // convert latitude/longitude coordinates to flat Cartesian plane
        const projection = d3.geoNaturalEarth1()
        .scale(140)
        .translate([width / 2, height / 1.4]); // translate to center of SVG
        const pathGenerator = d3.geoPath().projection(projection);
        
        continuous("#legend1", colorScale);
        
        // const colorScale = d3.scaleSequential()
        //     .domain([0, 10])
        //     .interpolator(d3.interpolatePlasma);
        
        // continuous("#legend1", colorScale);

        // function continuous(selector_id, colorscale) {
        //     var legendheight = 200,
        //         legendwidth = 80,
        //         margin = { top: 10, right: 60, bottom: 10, left: 2 };

        //     var canvas = d3.select(selector_id)
        //         .style("height", legendheight + "px")
        //         .style("width", legendwidth + "px")
        //         .style("position", "relative")
        //         .append("canvas")
        //         .attr("height", legendheight - margin.top - margin.bottom)
        //         .attr("width", 1)
        //         .style("height", (legendheight - margin.top - margin.bottom) + "px")
        //         .style("width", (legendwidth - margin.left - margin.right) + "px")
        //         .style("border", "1px solid #000")
        //         .style("position", "absolute")
        //         .style("top", (margin.top) + "px")
        //         .style("left", (margin.left) + "px")
        //         .node();

        //     var ctx = canvas.getContext("2d");

        //     var legendscale = d3.scaleLinear()
        //         .range([1, legendheight - margin.top - margin.bottom])
        //         .domain(colorscale.domain());

        //     // image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
        //     var image = ctx.createImageData(1, legendheight);
        //     d3.range(legendheight).forEach(function (i) {
        //         var c = d3.rgb(colorscale(legendscale.invert(i)));
        //         image.data[4 * i] = c.r;
        //         image.data[4 * i + 1] = c.g;
        //         image.data[4 * i + 2] = c.b;
        //         image.data[4 * i + 3] = 255;
        //     });
        //     ctx.putImageData(image, 0, 0);

        //     // A simpler way to do the above, but possibly slower. keep in mind the legend width is stretched because the width attr of the canvas is 1
        //     // See http://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas
        //     /*
        //     d3.range(legendheight).forEach(function(i) {
        //       ctx.fillStyle = colorscale(legendscale.invert(i));
        //       ctx.fillRect(0,i,1,1);
        //     });
        //     */

        //     var legendaxis = d3.axisRight()
        //         .scale(legendscale)
        //         .tickSize(6)
        //         .ticks(8);

        //     var svg = d3.select(selector_id)
        //         .append("svg")
        //         .attr("height", (legendheight) + "px")
        //         .attr("width", (legendwidth) + "px")
        //         .style("position", "absolute")
        //         .style("left", "0px")
        //         .style("top", "0px")

        //     svg
        //         .append("g")
        //         .attr("class", "axis")
        //         .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
        //         .call(legendaxis);
        // };







            
            
            // svg.append("g")
            //     .attr("class", "colorLegend")
        //     .attr("transform", "translate(500, 200)")
        //     .append(() => legend({
        //         color: colorScale,
        //         title: "População (em Milhões de habitantes)",
        //         width: 250,
        //         tickFormat: ".1f"
        //     }));
            
        // var labels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        // var colorLegend = d3.legendColor()
        //     .shapeWidth(30)
        //     .cells(10)
        //     .orient("horizonatal")
        //     .scale(colorScale)
        //     .labels(d => labels[d.i])
        //     .title("Ladder Score");
        // svg.select(".colorLegend")
        //     .call(colorLegend);
        


        g.append("path")
            .attr("class", "sphere")
            .attr("d", pathGenerator({ type: "Sphere" }));

        // returns promise
        d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json")
            .then(response => {
                // convert TopoJSON to GeoJSON in memory, e.g., topojson.feature(topology, object)
                const countries = topojson.feature(response, response.objects.countries);

                // data join: make one SVG path element for each country/piece of data                
                g.selectAll("path")
                    .data(countries.features)
                    .enter()
                    .append("path")
                    .attr("d", d => pathGenerator(d)) // function takes one feature as argument, uses pathGenerator
                    .attr("id", d => {
                        return `${d.id}`;
                    })
                    .attr("opacity", "90%")
                    .attr("cursor", "pointer")
                    .attr("class", "country")
                    .attr("fill", d => {
                        const countryName = this.countryNames[parseInt(d.id)];
                        if (this.data[countryName]) {
                            const ladderScore = parseFloat(this.data[countryName]["Ladder score"]);
                            return colorScale(ladderScore);
                        }
                        else {
                            return "#cccccc";
                        }
                    })
                    .append("title")
                    .text(d => {
                        const countryName = this.countryNames[parseInt(d.id)];
                        return countryName;
                    });

                document.querySelectorAll(".country").forEach(el => {
                    el.addEventListener("mouseover", this.handleMouseOver);
                    el.addEventListener("mouseout", this.handleMouseOut);
                });

                
                
            });            
        
        svg.call(d3.zoom()
            .on("zoom", (event, d) => {
                g.attr("transform", event.transform);
            }));
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

        target.setAttribute("style", "opacity: 100%;");
        target.setAttribute("style", "stroke-width: 1.4px");
        this.createTooltip(target);
        // const tooltip = document.querySelector(".tooltip");
        // tooltip.setAttribute("style", "display: block;");
    }

    handleMouseOut(event) {
        const target = event.target;
        target.setAttribute("style", "fill: #cccccc;")
        target.setAttribute("style", "opacity: 90%;")

        // const tooltip = document.querySelector(".tooltip");
        // tooltip.setAttribute("style", "display: none;");
    }

    createTooltip(target) {
        const countryName = this.countryNames[parseInt(target.id)];
        const dataHash = this.data[countryName];

        const table = document.querySelector(".tooltip");
        // table.setAttribute("class", "selected");

        const countryNameRow = document.getElementById("country-name");
        countryNameRow.textContent = countryName;

        const ladderScoreRow = document.getElementById("ladder-score")
        ladderScoreRow.textContent = `${dataHash["Ladder score"]}`;

        const gdpRow = document.getElementById("gdp")
        gdpRow.textContent = `${dataHash["Logged GDP per capita"]}`;

        const socialSupportRow = document.getElementById("social-support")
        socialSupportRow.textContent = `${dataHash["Social support"]}`;

        const lifeExpectancyRow = document.getElementById("life-expectancy")
        lifeExpectancyRow.textContent = `${dataHash["Healthy life expectancy"]}`;

        const freedomRow = document.getElementById("freedom")
        freedomRow.textContent = `${dataHash["Freedom to make life choices"]}`;

        const generosityRow = document.getElementById("generosity")
        generosityRow.textContent = `${dataHash["Generosity"]}`;

        const corruptionRow = document.getElementById("corruption")
        corruptionRow.textContent = `${dataHash["Perceptions of corruption"]}`;
    }
}

export default WorldMap;