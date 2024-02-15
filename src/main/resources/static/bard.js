// global variables -------------------------------------------------------------------------------

let billettArray = []; //empty array on init

let billett; //buffer object for temp storing of values before array push

// error message toggle function ------------------------------------------------------------------

function toggleElementSynlighet(elementId, visIsTrue) {
    if (visIsTrue){
        document.getElementById(elementId).style.display = "inline";
    } else {
        document.getElementById(elementId).style.display = "none";
    }
}

// input validation functions ---------------------------------------------------------------------

const regExp = {
    film: /[^ ]/,
    antall: /^[1-9][0-9]?$/,
    navn: /^[^0-9]+$/,
    telefonnr: /^[0-9]+$/,
    epost: /^([a-å]?[0-9]?)+@([a-å]?[0-9]?)+.[a-å]+/
}

function validerInput(id, regExp) {
    let input = document.getElementById(id).value;
    let inputGyldig = regExp.test(input);
    toggleElementSynlighet(id+"UgyldigMelding",!inputGyldig);
    return inputGyldig;
}

function validerFilm() {
    return validerInput("film", regExp.film);
}

function validerAntall() {
    return validerInput("antall", regExp.antall);
}

function validerFornavn() {
    return validerInput("fornavn", regExp.navn);
}

function validerEtternavn() {
    return validerInput("etternavn", regExp.navn);
}

function validerTelefonnr() {
    return validerInput("telefonnr", regExp.telefonnr);
}

function validerEpost() {
    return validerInput("epost", regExp.epost);
}


// ticket updating and storing functions ----------------------------------------------------------

function lagNyBillett(){
    billett = {
        film: document.getElementById("film").value,
        antall: document.getElementById("antall").value,
        fornavn: document.getElementById("fornavn").value,
        etternavn: document.getElementById("etternavn").value,
        telefonnr: document.getElementById("telefonnr").value,
        epost: document.getElementById("epost").value
    }
}

function lagreBillettIArray() {
    billettArray.push(billett);
}

function tomBestillingsSkjema() {
    document.getElementById("bestillingsskjema").reset();
}


// main functions ---------------------------------------------------------------------------------

function validerSkjema() {
    let inputSjekkArray = [
        validerFilm(),
        validerAntall(),
        validerFornavn(),
        validerEtternavn(),
        validerTelefonnr(),
        validerEpost(),
    ]
    return !inputSjekkArray.includes(false);
    // form validation done with bool array so all validation functions are
    // called even if a 'false' appears early on. This is to give a complete
    // update on error messages on which fields are in need of correction.
}

function kjopBillett(){
    if (validerSkjema())
    {
        lagNyBillett();
        lagreBillettIArray();
        tomBestillingsSkjema();
        console.log(billettArray); //only for debugging
    }
}

// manglar: visBillettArray, resetBillettArray