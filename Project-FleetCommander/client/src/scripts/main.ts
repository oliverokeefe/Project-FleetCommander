
import type { stats, statKey } from '../../../shared/src/types/types';


type dataModel = {
    name: string,
    nameInput: HTMLInputElement,
    stats: stats,
    statInputs: { [stat in statKey]: HTMLInputElement }
    statInputHandler: Function
};

let _data: dataModel = {
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
    statInputHandler: function (stat: statKey) {
        _data.stats[stat] = +_data.statInputs[stat].value;
        console.log(_data);
        return;
    }
};



function populateDOMElementVariables() {

    _data.nameInput = document.getElementById("nameInput") as HTMLInputElement;

    Object.keys(_data.statInputs).forEach(function (stat: statKey) {
        _data.statInputs[stat] = document.getElementById(`${stat}Input`) as HTMLInputElement;
    });

    return;
}

function addHandlers() {



    Object.keys(_data.statInputs).forEach(function (stat: statKey) {
        _data.statInputs[stat].addEventListener('change', () => { _data.statInputHandler(stat) });
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






