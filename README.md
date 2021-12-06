# Global Happiness

[Global Happiness Live!](https://rebeccamrfoster.github.io/GlobalHappiness/#)

## Overview

Global Happiness is a data visualization of the World Happiness Report 2021. The world map is colored according to each country's Ladder Score, which is a numerical value between 1 and 10 representing the degree to which people feel happy with their lives. Darker colors indicate lower levels of happiness, and lighter colors indicate higher levels of happiness.

<p align="center">
  <img src="https://user-images.githubusercontent.com/88195745/144770668-1ad09828-8047-4433-8e6e-dc78731db0c6.gif" height="350px" width="auto" />
</p>

## Technologies
- Vanilla JavaScript
- SCSS
- HTML5
- D3.js
- Kaggle (to source data)

## Features & Technical Challenges

Utilized the D3 JavaScript library to build a realistic, zoomable world map and manipulate the color fill of each country based on data from the World Happiness Report.

Built a Tooltip feature using mouse event listeners to toggle the visibility and inner HTML of the Tooltip element, allowing users to hover over each country to view its specific associated statistics.

Incorporated the CSS3 Flexbox model and media queries to produce a clean and responsive web page.

In Global Happiness, users will be able to:
- Hover over a country to reveal the specific Ladder Score pertaining to the country as well as other factors that contribute to its score.
- Zoom in an out to view the map more clearly.
- Use the color legend to understand what the color of a country signifies.
- Click on the link to the World Happiness Report to learn more about the study.

Using JavaScript's `async`/`await` pattern, I fetched the World Happiness Report data
```javascript
async function fetchData() {
    let data;
    data = await d3.csv("https://github.com/rebeccamrfoster/GlobalHappinessDataset/blob/main/world-happiness-report-2021.csv");
    const dataByName = parseDataByName(data);

    data = await d3.tsv("https://raw.githubusercontent.com/KoGor/Map-Icons-Generator/master/data/world-110m-country-names.tsv");
    const nameById = parseNameById(data);

    createModal();
    createFooter();
    new WorldMap(dataByName, nameById);
}

fetchData();
```

```javascript
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
            .attr("d", d => pathGenerator(d))
}
```

In addition, Global Happiness will include:
- A description about what the data signifies and how to interact with the visualization.
- A footer at the bottom of the page with the year and my name.
- A favicon.
- A README file that explains the functionality and purpose of the project, including a Table of Contents, screenshots, and code snippets.
