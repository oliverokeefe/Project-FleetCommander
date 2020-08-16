import { MainModel } from '../classes/MainModel.js';
let Model = undefined;
function init() {
    Model = new MainModel();
    console.log("initialized");
    return;
}
window.onload = function () {
    init();
    return;
};
//# sourceMappingURL=main.js.map