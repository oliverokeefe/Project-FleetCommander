let input = undefined;
let button = undefined;
function inputHandler() {
    return;
}
function buttonHandler() {
    if (input) {
        console.log(input.value);
    }
    return;
}
function populateDOMElementVariables() {
    input = document.getElementById("Name");
    button = document.getElementById("Enter");
    return;
}
function addHandlers() {
    button.addEventListener("click", buttonHandler);
    return;
}
function init() {
    populateDOMElementVariables();
    addHandlers();
    console.log("initialized");
    return;
}
window.onload = function () {
    init();
    return;
};
//# sourceMappingURL=main.js.map