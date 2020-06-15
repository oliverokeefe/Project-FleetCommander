let _data = {
    name: undefined,
    nameInput: undefined,
    stats: {
        str: undefined,
        dex: undefined,
        con: undefined,
        int: undefined,
        wis: undefined,
        cha: undefined
    },
    statInputs: {
        str: undefined,
        dex: undefined,
        con: undefined,
        int: undefined,
        wis: undefined,
        cha: undefined
    },
    statInputHandler: function (stat) {
        _data.stats[stat] = +_data.statInputs[stat].value;
        console.log(_data);
        return;
    }
};
function populateDOMElementVariables() {
    _data.nameInput = document.getElementById("nameInput");
    Object.keys(_data.statInputs).forEach(function (stat) {
        _data.statInputs[stat] = document.getElementById(`${stat}Input`);
    });
    return;
}
function addHandlers() {
    Object.keys(_data.statInputs).forEach(function (stat) {
        _data.statInputs[stat].addEventListener('change', () => { _data.statInputHandler(stat); });
    });
    return;
}
function init() {
    populateDOMElementVariables();
    addHandlers();
    console.log("initialized");
    console.log(_data);
    return;
}
window.onload = function () {
    init();
    return;
};
//# sourceMappingURL=main.js.map