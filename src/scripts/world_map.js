// import { select, json } from 'd3';
import * as d3 from "d3";
import { feature } from "topojson";

class WorldMap {
    constructor() {

        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.createMap();

        // d3.text("/data/world-happiness-report-2021.csv").then(function (data) {
        //     console.log(data[0]);
        // });

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
                    .attr("d", d => pathGenerator(d)); // function takes one feature as argument, uses pathGenerator

                document.querySelectorAll("path").forEach(el => {
                    el.addEventListener("mouseover", this.handleMouseOver);
                    el.addEventListener("mouseout", this.handleMouseOut);
                });
            });
    }

    handleMouseOver(event) {
        const target = event.target;
        target.setAttribute("style", "fill: #a70c70;");
        // target.setAttribute("style", "opacity: 40%;");
    }

    handleMouseOut(event) {
        const target = event.target;
        target.setAttribute("style", "fill: #cccccc;")
        target.setAttribute("style", "opacity: 100%;")
    }

}

export default WorldMap;