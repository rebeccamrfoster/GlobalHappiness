import WorldMap from "./scripts/world_map.js";
import { modal } from "./scripts/modal";

document.addEventListener("DOMContentLoaded", () => {
    modal();
    new WorldMap();
});
