class Tooltip {
    constructor(countryName, dataHash) {
        const html = `
            <table>
                <tr>
                    <th colspan="2" id="country-name">${countryName}</th>
                </tr>
                <tr>
                    <th>Ladder score:</th>
                    <td id="ladder-score">${dataHash["Ladder score"]}</td>
                </tr>
                <tr>
                    <th>GDP per capita:</th>
                    <td id="gdp">${dataHash["Logged GDP per capita"]}</td>
                </tr>
                <tr>
                    <th>Social support:</th>
                    <td id="social-support">${dataHash["Social support"]}</td>
                </tr>
                <tr>
                    <th>Healthy life expectancy:</th>
                    <td id="life-expectancy">${dataHash["Healthy life expectancy"]}</td>
                </tr>
                <tr>
                    <th>Freedom to make life choices:</th>
                    <td id="freedom">${dataHash["Freedom to make life choices"]}</td>
                </tr>
                <tr>
                    <th>Generosity:</th>
                    <td id="generosity">${dataHash["Generosity"]}</td>
                </tr>
                <tr>
                    <th>Perceptions of corruption:</th>
                    <td id="corruption">${dataHash["Perceptions of corruption"]}</td>
                </tr>
            </table>
        `;

        const tooltip = document.querySelector(".tooltip");
        tooltip.innerHTML = "";
        tooltip.innerHTML = html;
    }
}

export default Tooltip;
