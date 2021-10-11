### Background:
Global Happiness is a data visualization that uses the results of the World Happiness Report 2021. Specifically, it looks at the Ladder Score, which is a numerical value between 1 and 10 representing the level to which people report to feeling happy with their lives.

Global Happiness uses a color scale to represent the varying degrees of happiness across the world, with darker colors indicating lower levels of happiness and lighter colors indicating higher levels of happiness. The user can hover over a single color on the color legend to highlight only the countries whose Ladder Score is within that range.

### Functionality & MVPs:
In Global Happiness, users will be able to:
- Hover over a country to reveal the specific Ladder Score pertaining to the country.
- Click on the description to read more about what the data signifies and how to interact with the visualization.
- Hover over a single part of the color legend to view only the countries within that range of the Ladder Score.
- Select a particular continent from a list on the side to view only the countries within that region.

In addition, Sense will include:
- A footer at the bottom of the page with the year, my name, and a link to my GitHub.
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
