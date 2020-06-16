
import type { stats, statKey } from '../../../shared/src/types/types';

let input: HTMLInputElement = undefined;
let button: HTMLButtonElement = undefined;


function inputHandler(): void {
    return;
}


function buttonHandler(): void {
    if (input) {
        console.log(input.value);
    }
    return;
}


function populateDOMElementVariables() {

    input = document.getElementById("Name") as HTMLInputElement;
    button = document.getElementById("Enter") as HTMLButtonElement;

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





