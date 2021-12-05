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
                    // .append(d => {
                        // const countryName = this.nameById[parseInt(d.id)];
                        // const tooltip = document.createElement("div");
                        // tooltip.classList.add("tooltip");
                        // debugger
                        // if (this.dataByName[countryName]) {
                        //     const dataHash = this.dataByName[countryName];
                        //     const table = Tooltip(countryName, dataHash);
                        //     tooltip.insertAdjacentHTML("afterbegin", table);
                        // }
                        // return tooltip;
                    // })
                
                document.querySelectorAll("path.country").forEach(path => {
                    const box = path.getClientRects()[0];

                    const countryName = this.nameById[parseInt(path.id)];
                    const tooltip = document.createElement("div");
                    tooltip.classList.add(`${countryName.split(" ").join("-")}`, "tooltip");

                    const dataHash = this.dataByName[countryName];
                    const table = Tooltip(countryName, dataHash);

                    tooltip.insertAdjacentHTML("afterbegin", table);
                    // tooltip.style.left = `${box.x - box.width / 2}px`;
                    // tooltip.style.top = `${box.y + box.height / 2}px`;
                    const body = document.querySelector("body");
                    body.append(tooltip);
                })
                    // .append("title")
                    // .text(d => this.nameById[parseInt(d.id)]);

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
        currentTarget.setAttribute("style", "opacity: 100%;");
        currentTarget.setAttribute("style", "stroke-width: 1.4px");

        // Instantiate Tooltip:
        const countryName = this.nameById[parseInt(currentTarget.id)];
        // const dataHash = this.dataByName[countryName];
        // new Tooltip(countryName, dataHash);
        // debugger
        const tooltip = document.querySelector(`.${countryName.split(" ").join("-")}.tooltip`);
        // debugger
        const xCoord = event.pageX;
        const yCoord = event.pageY;
        debugger
        tooltip.style.left = `${xCoord}px`;
        tooltip.style.top = `${yCoord}px`;
        tooltip.classList.add("show");
        // tooltip.style.visibility = "visible";
    }

    handleMouseout(event) {
        const currentTarget = event.currentTarget;
        // currentTarget.setAttribute("style", "fill: #cccccc;");
        currentTarget.setAttribute("style", "opacity: 90%;");
        const countryName = this.nameById[parseInt(currentTarget.id)];
        const tooltip = document.querySelector(`.${countryName.split(" ").join("-")}.tooltip`);
        tooltip.classList.remove("show");
        // tooltip.style.visibility = "hidden";
    }
}

export default WorldMap;
