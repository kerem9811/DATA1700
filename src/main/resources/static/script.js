'use strict';
// Fra W3schools: "Strict mode makes it easier to write "secure" JavaScript. Strict mode changes previously accepted "bad syntax" into real errors."

// Begynner med å lage et array til billettene
let billetter = [];
// Lager så et tomt billett-objekt som mellomlagring
let billett = {};

// En funksjon som slår feilmelding av og på hvis regex sjekk feiler.

// DENNE FUNKER IKKE, ER OGSAA AVSLAATT I REGEXSJEKK
function showOnOff(id, showOn, errorMessage) {
    if (showOn) {
        document.getElementById(id + "feilmelding").innerHTML = errorMessage;
    } else {
        document.getElementById(id + "feilmelding").innerHTML = "";
    }
}
const errorMessage = {
    film: "Du må velge en film",
    antall: "Du må velge et antall",
    navn: "Du må skrive inn et navn, kan kun inneholde bokstaver",
    telefonnr: "Du må skrive inn et telefonnummer, kan kun inneholde tall",
    epost: "Du må skrive inn en gyldig epost-adresse"
}

// Forskjellig regex-formatering avhengig av input ----------------------------------------------------
function regexSjekk(id, regEx) {
    let input = document.getElementById(id).value;
    let inputOK = regEx.test(input);
    // showOnOff(id + "feilmelding", !inputOK);
    return inputOK;
}

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
    epost: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
}

// Funksjon som sjekker inndata -------------------------------------------------------------------
function sjekkSkjema() {
    // Et array med funksjonene som skal sjekke RegEx
    let inputArray = [
        sjekkFilm(),
        sjekkAntall(),
        sjekkFornavn(),
        sjekkEtternavn(),
        sjekkTelefonnr(),
        sjekkEpost()
    ]
    // Hvis alle verdier kommer tilbake som sanne blir sjekkSkjema-verdien også sann
    if (!inputArray.includes(false)) {
        return true;
    }
}
function sjekkFilm() {
    return regexSjekk("film", regEx.film);
}

function sjekkAntall() {
    return regexSjekk("antall", regEx.antall);
}

function sjekkFornavn() {
    return regexSjekk("fornavn", regEx.navn);
}

function sjekkEtternavn() {
    return regexSjekk("etternavn", regEx.navn);
}

function sjekkTelefonnr() {
    return regexSjekk("tlf", regEx.telefonnr);
}

function sjekkEpost() {
    return regexSjekk("epost", regEx.epost);
}

// Funksjon som lager en ny billett med input-data -------------------------------------------
function nyBillett() {
    billett = {
        // film: document.getElementById("film").value,
        film: $("#film"),
        antall: $("#antall"),
        fornavn: $("#fornavn"),
        etternavn: $("#etternavn"),
        telefonnumer: $("#tlf"),
        epost: $("#epost"),
    }
}

// Flytter objektet til billett-arrayet
function pushBillett() {
    billetter.push(billett);
}

// Funksjon som viser info om billetter i billettarrayet
function visKjop() {
    // Begynner med å lage table head
    let ut = "<table id='liste'><tr>" +
        "<th>Film</th><th>Antall</th><th>Navn</th><th>Etternavn</th><th>Telefonnr</th><th>Epost</th>" + "</tr>";
    // Så blir hver billett printet i en tabell gjennom en for-løkke
    for (let i of billetter) {
        ut += "<tr>";
        ut += "<td>" + i.film + "</td><td>" + i.antall + "</td><td>" + i.fornavn + "</td><td>" + i.etternavn + "</td><td>" + i.telefonnr + "</td><td>" + i.epost + "</td>";
        ut += "</tr>";
    }
    // document.getElementById("liste").innerHTML = ut;
    $("#liste").innerHTML = ut;
}

// Resetter skjemaet
function tomSkjema() {
    $(".skjema").val("");
}

// En samlefunksjon som sjekker om regex-sjekk er ok, så lager ny billett med input, flytter billetten til arrayet,
// viser billett-array i konsoll-logg for debug, så printer en tabell med billettene, før den tømmer skjemadata.
// Hvis det kommer en feil i regex-sjekk vises det hvor det ble feil, og det kommer en liten alert-box :)
function ticketPlease() {
    nyBillett();
    pushBillett();
    console.log(billetter);
    visKjop();
    tomSkjema();

    // MÅ TA DE ØVERSTE FUNKSJOENEN INNI IF SETNINGA!

    // if (sjekkSkjema() === true) {
    // } else {
    //     alert("Noe ble feil, sjekk skjema :(")
    // }
}

// Funksjon som sletter alle billetter (tømmer arrayet)
function slettAlt() {
    billetter.length = 0;
    document.getElementById("liste").innerHTML = "";
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
    $("#tlf").val(90123456);
    // document.getElementById("epost").value = "epost@epost.no";
    $("#epost").val("epost@epost.no")
}