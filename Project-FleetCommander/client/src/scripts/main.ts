import { MainModel } from '../classes/MainModel.js';


let Model: MainModel = undefined;


function init() {
    Model = new MainModel();
    console.log("initialized");
    return;
}

window.onload = function () {
    init();
    return;
};

