// import { MainModel } from '../classes/MainModel.js';
import * as MainModel from '../classes/MainModel.js';


// let Model: MainModel = undefined;


function init() {
    // Model = new MainModel();
    MainModel.init();
    console.log("initialized");
    return;
}

window.onload = function () {
    init();
    return;
};

