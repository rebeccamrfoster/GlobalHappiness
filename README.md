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

## Core Features

### World Map
I built a realistic, zoomable world map with the help of the D3 JavaScript library. Utilizing JavaScript's `async`/`await` pattern, I fetched data from the World Happiness Report 2021 before instantiating the `WorldMap` class, passing the fetched data into its constructor function.

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

Each country is represented by a unique `path` element created from the topographic information provided by D3. The fill color each `path` element is manipulated according to the country's Ladder Score. Countries without color did not participate in the study.

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

### Tooltip
Hovering over a particular country reveals a Tooltip displaying the other factors that were tested in the study and that may contribute to the Ladder Score. The Tooltip feature was constructed using Vanilla JavaScript to manipulate the DOM and event listeners to detect when the country was being hovered over. The `show` class is added to the Tooltip element upon `mouseenter` and removed upon `mouseout`, toggling both the `display` and `opacity` properties of the element and its descendants.

### Modal
When the user clicks on the "About" section in the navigation bar, a modal containing information about how to interact with the site and what the data represents appears on the screen. The modal container acts as an overlay, drawing focus to the modal in the center of the screen and increasing readability. Event listeners were added to the "About" button and "X" button on the modal to toggle the modal's `opacity` and `pointer-events` properties. I also incorporated the CSS3 Flexbox model to produce a clean and responsive web page.

```javascript
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(255, 255, 255, 0.2);

  display: flex;
  justify-content: center;
  align-items: center;

  transition: all 0.2s ease;
  opacity: 0;
  pointer-events: none;

  &.show {
      opacity: 1;
      pointer-events: auto;
  }
}
```
