import * as d3 from "d3";
import { convertName } from "./convert_name";

function getCountryNamesData() {
    const parsedData = {};
    d3.csv("https://raw.githubusercontent.com/rebeccamrfoster/javascript_project_dataset/main/world-happiness-report-2021.csv")
        .then(response => {
            response.forEach(country => {
                const countryName = country["Country name"];
                parsedData[countryName] = country;
            });
        });
    return parsedData;
}
const dataByName = getCountryNamesData();

function getWorldHappinessData() {
    const parsedData = {};
    d3.tsv("https://raw.githubusercontent.com/KoGor/Map-Icons-Generator/master/data/world-110m-country-names.tsv")
        .then(response => {
            response.forEach(country => {
                if (convertName[country.name]) country.name = convertName[country.name];
                parsedData[parseInt(country.id)] = country.name;
            })
        });
    return parsedData;
}
const nameById = getWorldHappinessData();

export { dataByName, nameById };
