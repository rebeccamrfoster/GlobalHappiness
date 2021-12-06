import * as d3 from "d3";
import WorldMap from "./scripts/world_map.js";
import { createModal } from "./scripts/modal";
import { createFooter } from "./scripts/footer.js";
import { parseDataByName, parseNameById } from "./scripts/parse_data";

document.addEventListener("DOMContentLoaded", () => {    
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
});
