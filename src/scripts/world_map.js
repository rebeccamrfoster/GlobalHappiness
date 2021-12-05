import * as d3 from "d3";
import { colorScale } from "./color_scale";
import Tooltip from "./tooltip";

class WorldMap {
    constructor(dataByName, nameById) {
        this.handleMouseenter = this.handleMouseenter.bind(this);
        this.handleMouseout = this.handleMouseout.bind(this);
        this.dataByName = dataByName;
        this.nameById = nameById;
        this.createMap();
    }

    createMap() {
        const width = 900;
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
                    .data(countries.features, (d, i) =>  d + i )
                    .enter()
                    .append("path")
                    .attr("centroid", d => d3.geoCentroid(d))
                    .attr("d", d => pathGenerator(d)) // Function takes one feature as argument
                    .attr("opacity", "90%")
                    .attr("id", d => `${d.id}`)
                    // Add cursor "pointer" to participating countries:
                    .attr("cursor", d => (
                        this.dataByName[this.nameById[parseInt(d.id)]] ?
                            "pointer" : null
                    ))
                    // Add class "country" to participating countries:
                    .attr("class", d => {
                        const countryName = this.nameById[parseInt(d.id)];
                        return this.dataByName[countryName] ?
                            `country ${countryName}` : null
                    })
                    .attr("fill", d => {
                        // If the country is represented in dataByName object 
                        // and therefore participated in the study:
                        const countryName = this.nameById[parseInt(d.id)];
                        if (this.dataByName[countryName]) {
                            const ladderScore = parseFloat(this.dataByName[countryName]["Ladder score"]);
                            return colorScale(ladderScore);
                        }
                        // Country did not participate in the study:
                        else {
                            return "#cccccc";
                        }
                    })
                
                document.querySelectorAll("path.country").forEach(path => {
                    const countryName = this.nameById[parseInt(path.id)];
                    const dataHash = this.dataByName[countryName];
                    const body = document.querySelector("body");

                    // Create tooltip:
                    const tooltip = document.createElement("div");
                    tooltip.classList.add(`${countryName.split(" ").join("-")}`, "tooltip");
                    const table = Tooltip(countryName, dataHash);
                    tooltip.insertAdjacentHTML("afterbegin", table);
                    
                    body.append(tooltip);
                })

                document.querySelectorAll(".country").forEach(country => {
                    country.addEventListener("mouseenter", this.handleMouseenter);
                    country.addEventListener("mouseout", this.handleMouseout);
                });
            });

        // Add zoom functionality:
        const zoom = d3.zoom()
            .on("zoom", (event, d) => g.attr("transform", event.transform));
        zoom(svg);
    }

    handleMouseenter(event) {
        const currentTarget = event.currentTarget;

        // Country style:
        currentTarget.setAttribute("style", "opacity: 100%;");
        currentTarget.setAttribute("style", "stroke-width: 1.4px");

        // Tooltip style:
        const countryName = this.nameById[parseInt(currentTarget.id)];
        const tooltip = document.querySelector(`.${countryName.split(" ").join("-")}.tooltip`);
        const xCoord = event.pageX;
        const yCoord = event.pageY;
        tooltip.style.left = `${xCoord}px`;
        tooltip.style.top = `${yCoord}px`;
        tooltip.classList.add("show");
    }

    handleMouseout(event) {
        const currentTarget = event.currentTarget;

        // Country style:
        currentTarget.setAttribute("style", "opacity: 90%;");

        // Tooltip style:
        const countryName = this.nameById[parseInt(currentTarget.id)];
        const tooltip = document.querySelector(`.${countryName.split(" ").join("-")}.tooltip`);
        tooltip.classList.remove("show");
    }
}

export default WorldMap;
