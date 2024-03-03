'use strict';
// Fra W3schools: "Strict mode makes it easier to write "secure" JavaScript. Strict mode changes previously accepted "bad syntax" into real errors."

// Begynner med å lage et array til billettene
let billetter = [];
// Lager så et tomt billett-objekt som mellomlagring
let billett = {};

const errorMessage = {
    film: "Du må velge en film.",
    antall: "Du må velge antall mellom 1-99",
    navn: "Du må skrive inn et navn.",
    telefonnr: "Du må skrive inn et gyldig norsk telefonnummer.",
    epost: "Du må skrive inn en gyldig epost-adresse."
}

// Forskjellig regex-formatering avhengig av input ----------------------------------------------------
const regEx = {
    // Det må velges en film
    film: /[^ ]/,
    // Antall må være 1-99
    antall: /^[1-9][0-9]?$/,
    // Kan ikke stå tom, har også required tag i html. (https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/)
    navn: /^(?!\s*$).+/i,
    // Aksepterer nummer med 8 siffer som begynner med 2-9, eller et internasjonalt nummer med minimum 6 siffer. (https://nkom.no/telefoni-og-telefonnummer/telefonnummer-og-den-norske-nummerplan/alle-nummerserier-for-norske-telefonnumre)
    telefonnr: /^(?:[2-9]\d{7}|(?:\+|00)\d{6,})$/,
    // Aksepterer "normale" epost-adresser (https://www.regular-expressions.info/email.html)
    epost: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
}

/*function regexSjekk(id, regEx) {
    // let innData = document.getElementById(id).value;
    // return regexSjekk.test(innData);
    return regexSjekk.test(document.getElementById(id).value);
    // let innData = $("#id").val();
    /!* let input = $("#id").val(); /!*document.getElementById(id).value;*!/
     let inputOK = regEx.test(input);
     return regEx.test(input);
     // showErrorMessage(id + "feilmelding", !inputOK);
     showErrorMessage(id + "feilmelding", !inputOK);
     showErrorMessage(id +)*!/
    // return inputOK;
}*/

// Funksjon som sjekker inndata -------------------------------------------------------------------
function sjekkFilm() {
    let inputOK = regEx.film.test($("#film").val());
    if (!inputOK) {
        $("#filmfeilmelding").html(errorMessage.film);
    } else {
        $("#filmfeilmelding").html("");
    }
    return inputOK;
    // showErrorMessage("film", !inputOK, errorMessage.film);
    /* regexSjekk("film", regEx.film);
    regexSjekk.test(document.getElementById(id).value);*/
}

function sjekkAntall() {
    let inputOK = regEx.antall.test($("#antall").val());
    if (!inputOK) {
        $("#antallfeilmelding").html(errorMessage.antall);
    } else {
        $("#antallfeilmelding").html("");
    }
    return inputOK;
    // let inputOK = regexSjekk("antall", regEx.antall);
    // showErrorMessage("antall", !inputOK, errorMessage.antall);
}

function sjekkFornavn() {
    let inputOK = regEx.navn.test($("#fornavn").val());
    if (!inputOK) {
        $("#fornavnfeilmelding").html(errorMessage.navn);
    } else {
        $("#fornavnfeilmelding").html("");
    }
    return inputOK;
    // let inputOK = regexSjekk("fornavn", regEx.navn);
    // showErrorMessage("fornavn", !inputOK, errorMessage.navn);
}

function sjekkEtternavn() {
    let inputOK = regEx.navn.test($("#etternavn").val());
    if (!inputOK) {
        $("#etternavnfeilmelding").html(errorMessage.navn);
    } else {
        $("#etternavnfeilmelding").html("");
    }
    return inputOK;
    // showErrorMessage("etternavn", !inputOK, regEx.navn);
    // let inputOK = regexSjekk("etternavn", regEx.navn);
}

function sjekkTelefonnr() {
    let inputOK = regEx.telefonnr.test($("#tlf").val());
    if (!inputOK) {
        $("#tlffeilmelding").html(errorMessage.telefonnr);
    } else {
        $("#tlffeilmelding").html("");
    }
    return inputOK;
    // showErrorMessage("tlf", !inputOK, regEx.telefonnr);
    // let inputOK = regexSjekk("tlf", regEx.telefonnr);
}

function sjekkEpost() {
    let inputOK = regEx.epost.test($("#epost").val());
    if (!inputOK) {
        $("#epostfeilmelding").html(errorMessage.epost);
    } else {
        $("#epostfeilmelding").html("");
    }
    return inputOK;
    // let inputOK = regexSjekk("epost", regEx.epost);
    // showErrorMessage("epost", !inputOK, regEx.epost);
}

function sjekkSkjema() {
    // Et array med funksjonene som skal sjekke RegEx
    let inputArray = [
        sjekkFilm(),
        sjekkAntall(),
        sjekkFornavn(),
        sjekkEtternavn(),
        sjekkTelefonnr(),
        sjekkEpost(),
    ]
    // Hvis alle verdier kommer tilbake som sanne blir sjekkSkjema-verdien også sann
    if (!inputArray.includes(false)) {
        return true;
    }
}

// Funksjon som lager en ny billett med input-data -------------------------------------------
function nyBillett() {
    billett = {
        film: $("#film").val(),
        antall: $("#antall").val(),
        fornavn: $("#fornavn").val(),
        etternavn: $("#etternavn").val(),
        telefonnr: $("#tlf").val(),
        epost: $("#epost").val(),
    }
}

// Flytter objektet til billett-arrayet
function pushBillett() {
    billetter.push(billett);
}

// Funksjon som viser info om billetter i billettarrayet
function visKjop() {
    // Begynner med å lage table head
    let ut = "<tr>" +
        "<th>Film</th><th>Antall</th><th>Navn</th><th>Etternavn</th><th>Telefonnr</th><th>Epost</th>" +
        "</tr>";
    // Så blir hver billett printet i en tabell gjennom en for-løkke
    for (let i of billetter) {
        ut += "<tr>";
        ut += "<td>" + i.film + "</td><td>" + i.antall + "</td><td>" + i.fornavn + "</td><td>" + i.etternavn + "</td><td>" + i.telefonnr + "</td><td>" + i.epost + "</td>";
        ut += "</tr>";
    }
    // document.getElementById("liste").innerHTML = ut;
    $("#liste").html(ut);
}

// Resetter skjemaet
function tomSkjema() {
    $(".skjema").val("");
}

// En samlefunksjon som sjekker om regex-sjekk er ok, så lager ny billett med input, flytter billetten til arrayet,
// viser billett-array i konsoll-logg for debug, så printer en tabell med billettene, før den tømmer skjemadata.
// Hvis det kommer en feil i regex-sjekk vises det hvor det ble feil, og det kommer en liten alert-box :)
function ticketPlease() {
    if (sjekkSkjema()) {
        nyBillett();
        pushBillett();
        console.log(billetter);
        visKjop();
        tomSkjema();
    }/* else {
        alert("Noe ble feil, sjekk skjema :(")
    }*/
}

// Funksjon som sletter alle billetter (tømmer arrayet)
function slettAlt() {
    billetter.length = 0;
    $("#liste").html("");
}

// Fyll ut info knapp, for å slippe å skrive inn hver eneste gang :)
function fyllUtInfo() {
    // document.getElementById("film").value = 1;
    $("#film").val(1);
    // document.getElementById("antall").value = 1;
    $("#antall").val(1);
    // document.getElementById("fornavn").value = "Conan";
    $("#fornavn").val("Conan");
    // document.getElementById("etternavn").value = "The Barbarian";
    $("#etternavn").val("The Barbarian");
    // document.getElementById("tlf").value = 99702345;
    $("#tlf").val(22222222);
    // document.getElementById("epost").value = "epost@epost.no";
    $("#epost").val("epost@epost.no")
}