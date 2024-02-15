'use strict';
// Strict mode makes it easier to write "secure" JavaScript. Strict mode changes previously accepted "bad syntax" into real errors.

// Lager så et tomt array for billettene
let billetter = [];

/*Mellomlagring av billett
let billett;*/

const billettIder = ['film', 'antall', 'fornavn', 'etternavn', 'tlf', 'epost'];

// Veksle feilmelding av og på
function showOnOff(elementId, showOn) {
    if (showOn) {
        document.getElementById(elementId).style.display = "inline";
    } else {
        document.getElementById(elementId).style.display = "none";
    }
}

// Input validering
const regEx = {
    film: /[^ ]/,
    antall: /^[1-9][0-9]?$/,
    // Validerer ikke navn, har required tag i html så den ikke blir tom.
    telefonnr: /^(?:[2-9]\d{7}|(?:\+|00)\d{6,})$/,
    epost: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
}

function inputValidering(id, regEx) {
    let input = document.getElementById(id).value;
    let inputOK = regEx.test(input);
    showOnOff(id + "feilmelding", !inputOK);
    return inputOK;
}

function sjekkFilm() {
    return inputValidering("film", regEx.film);
}

function sjekkAntall() {
    return inputValidering("antall", regEx.antall);
}

// function sjekkFornavn() {
//     return inputValidering("fornavn", regEx.navn);
// }
//
// function sjekkEtternavn() {
//     return inputValidering("etternavn", regEx.navn);
// }

function sjekkTlf() {
    return inputValidering("tlf", regEx.telefonnr);
}

function sjekkEpost() {
    return inputValidering("epost", regEx.epost);
}

// Funksjon som lager billetter med input fra tekstfeltet
function lagBillett() {
    let billett = {};
    for (const billettId of billettIder) {
        billett[billettIder] = document.getElementById(billettId).value;
    }
    /*billett = {
        film: document.getElementById("film").value,
        antall: document.getElementById("antall").value,
        fornavn: document.getElementById("fornavn").value,
        etternavn: document.getElementById("etternavn").value,
        telefonnr: document.getElementById("tlf").value,
        epost: document.getElementById("epost").value
    }*/
}

function pushBillett() {
    billetter.push(billett);
}

function clearForm() {
    document.getElementById("orderform").reset();
}

function skjemaValidering() {
    let inputValideringArray = [
        sjekkFilm(),
        sjekkAntall(),
        // sjekkFornavn(),
        // sjekkEtternavn(),
        sjekkTlf(),
        sjekkEpost(),
    ]
    return !inputValideringArray.includes(false);
}

function kjopBillett() {
    if (skjemaValidering()) {
        lagBillett();
        pushBillett();
        console.log(billetter);
        visBilletter();
        clearForm();
    }
}

// En funksjon som viser bestillingen som ble gjort
function visBilletter() {
    const liste = document.getElementById('liste');
    liste.replaceChildren();

    for (const billett of billetter) {
        const row = table.appendChild(document.createElement('tr'));
        for (const billettId of billettIder) {
            const cell = row.appendChild(document.createElement('td'));
            cell.innerText = billett[billettId];
        }
    }
}

// Funksjon som sletter alle billetter (tømmer arrayet)
function slettAlt() {
    billetter.length = 0;
    document.getElementById("liste").innerHTML = "";
}