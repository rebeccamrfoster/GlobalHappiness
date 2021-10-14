import * as d3 from "d3";
import { colorScale } from "./color_scale";
import Tooltip from "./tooltip";
import { dataByName, nameById } from "./get_data";

class WorldMap {
    constructor() {
        this.handleMouseenterOver = this.handleMouseenterOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.createMap();
    }

    createMap() {
        const width = 800;
        const height = 500;

        const svg = d3.select(".map")
            .append("svg")
            .attr("height", height)
            .attr("width", width);
        const g = svg.append("g");
        
        // Convert latitude/longitude coordinates to natural Earth plane:
        const projection = d3.geoNaturalEarth1()
            .scale(140)
            .translate([width / 2, height / 2.0]);
        const pathGenerator = d3.geoPath().projection(projection);
        
        g.append("path")
            .attr("class", "sphere")
            .attr("d", pathGenerator({ type: "Sphere" }));

        d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json")
            .then(response => {
                // Convert TopoJSON to GeoJSON (e.g., topojson.feature(topology, object)):
                const countries = topojson.feature(response, response.objects.countries);

                // Define one SVG path element for each country:                
                g.selectAll("path")
                    .data(countries.features, function(d, i) { return d + i; })
                    .enter()
                    .append("path")
                    .attr("centroid", d => {
                        return d3.geoCentroid(d);
                    })
                    .attr("d", d => pathGenerator(d)) // Function takes one feature as argument
                    .attr("opacity", "90%")
                    .attr("cursor", "pointer")
                    .attr("class", "country")
                    .attr("id", d => {
                        return `${d.id}`;
                    })
                    .attr("fill", d => {
                        const countryName = nameById[parseInt(d.id)];
                        if (dataByName[countryName]) {
                            const ladderScore = parseFloat(dataByName[countryName]["Ladder score"]);
                            return colorScale(ladderScore);
                        }
                        else { // Country was not included in the study
                            return "#cccccc";
                        }
                    })
                    .append("title")
                    .text(d => {
                        const countryName = nameById[parseInt(d.id)];
                        return countryName;
                    });

                document.querySelectorAll(".country").forEach(country => {
                    country.addEventListener("mouseenter", this.handleMouseenterOver);
                    country.addEventListener("mouseout", this.handleMouseOut);
                });
            });

        // Add zoom functionality:
        const zoom = d3.zoom()
            .on("zoom", (event, d) => {
                g.attr("transform", event.transform);
            });
        zoom(svg);
    }

    handleMouseenterOver(event) {
        const target = event.target;
        target.setAttribute("style", "opacity: 100%;");
        target.setAttribute("style", "stroke-width: 1.4px");

        // Instantiate Tooltip:
        const countryName = nameById[parseInt(target.id)];
        const dataHash = dataByName[countryName];
        new Tooltip(countryName, dataHash);

        const tooltip = document.querySelector(".tooltip");
        const xCoord = event.pageX;
        const yCoord = event.pageY;
        tooltip.style.left = `${xCoord - 30}px`;
        tooltip.style.top = `${yCoord - 40}px`;
        tooltip.style.visibility = "visible";
    }

    handleMouseOut(event) {
        const target = event.target;
        target.setAttribute("style", "fill: #cccccc;");
        target.setAttribute("style", "opacity: 90%;");
        const tooltip = document.querySelector(".tooltip");
        tooltip.style.visibility = "hidden";
    }
}

export default WorldMap;
