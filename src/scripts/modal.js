export const createModal = () => {
    const open = document.querySelector(".open");
    const close = document.querySelector(".close");

    const modalContainer = document.querySelector(".modal-container");
    
    open.addEventListener("click", () => {
        modalContainer.classList.add("show");
    })
    
    close.addEventListener("click", () => {
        modalContainer.classList.remove("show");
    })

    modalContainer.addEventListener("click", event => {
        if (event.target === modalContainer) {
            modalContainer.classList.remove("show");
        }
    })
};