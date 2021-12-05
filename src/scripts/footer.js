export const createFooter = () => {
    const footer = document.querySelector("footer");
    const p = document.createElement("p");
    p.innerHTML = `&#169 ${new Date().getFullYear()} Developed by Rebecca Foster`;
    footer.append(p);
};