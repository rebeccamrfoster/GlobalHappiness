import * as d3 from "d3";

export const colorScale = d3.scaleSequential()
    .domain([0, 10])
    .interpolator(d3.interpolatePlasma);
