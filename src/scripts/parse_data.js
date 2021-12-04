import { convertName } from "./convert_name";

// Create object where keys are country names and values are objects
// containing data pertaining to country:
export const parseDataByName = data => {
    const parsedData = {};
    data.forEach(country => {
        const countryName = country["Country name"];
        parsedData[countryName] = country;
    })
    return parsedData;
};

// If country is in convertName object, reassign its name in parsedData object:
export const parseNameById = data => {
    const parsedData = {};
    data.forEach(country => {
        if (convertName[country.name]) country.name = convertName[country.name];
        parsedData[parseInt(country.id)] = country.name;
    })
    return parsedData;
};