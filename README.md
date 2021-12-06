# Global Happiness

[Global Happiness Live!](https://rebeccamrfoster.github.io/GlobalHappiness/#)

## Overview

Global Happiness is a data visualization of the World Happiness Report 2021. The world map is colored according to each country's Ladder Score, which is a numerical value between 1 and 10 representing the degree to which people feel happy with their lives. Darker colors indicate lower levels of happiness, and lighter colors indicate higher levels of happiness. All data was sourced from Kaggle.

<img src="https://user-images.githubusercontent.com/88195745/144770668-1ad09828-8047-4433-8e6e-dc78731db0c6.gif"
  align="middle" height="350px" width="auto" />

### Functionality & MVPs:
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

### Technologies, Libraries, & APIs:
- npm to manage packages in the JavaScript environment.
- Webpack to bundle JavaScript modules.
- D3 library to represent the data using a world map.
- Kaggle to source data from the World Happiness Report 2021.

### Implementation Timeline:
- FRIDAY AFTERNOON & WEEKEND: Create the project skeleton and basic HTML and CSS to render in the browser. Read about and experiment with the D3 interface. Create a map using TopoJSON, and load the dataset into the project. Connect the dataset with the map, so that each HTML element representing a country is somehow linked to the respective row in the CSV file.
- MONDAY: Create a color legend that changed the map representation when hovered over. Also create an element that appears with specific information about the Ladder Score when individual countries are hovered over.
- TUESDAY: Use HTML and CSS to create a simple navbar and instruction modal for the page.
- WEDNESDAY: Work on the CSS styling to create a clean, user-friendly design. Troubleshoot any last minute issues.
- THURSDAY MORNING: Deploy World Happiness to GitHub Pages and prepare for presentation in the afternoon.

### Wireframe:
![Screen Shot 2021-10-11 at 9 39 35 AM](https://user-images.githubusercontent.com/88195745/136799972-8e533c83-19e0-45aa-a85d-3e4b47033e5d.png)

