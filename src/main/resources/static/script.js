'use strict';
// Fra W3schools: "Strict mode makes it easier to write "secure" JavaScript. Strict mode changes previously accepted "bad syntax" into real errors."

$('document').ready(() => {

    $('#orderform').submit(ev =>{
        ev.preventDefault();
        ticketPlease();
    })

    $('#autofyll').click(autoFillInfo);
    $('#slettalt').click(deleteTickets);

    /* REFRESH TICKET TABLE METHOD*/
})


// Begynner med å lage et array til billettene
let tickets = [];
// Lager så et tomt billett-objekt som mellomlagring
let oneTicket = {};

// Forskjellig regex-formatering avhengig av input ----------------------------------------------------

// Sjekking av regex
const regEx = {
    // Det må velges en film
    film: /[^ ]/,
    // Antall må være 1-99
    amount: /^[1-9][0-9]?$/,
    // Kan ikke stå tom, har også required tag i html. (https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/)
    name: /^(?!\s*$).+/i,
    // Aksepterer nummer med 8 siffer som begynner med 2-7 eller 9, eller et internasjonalt nummer med minimum 6 siffer. (https://nkom.no/telefoni-og-telefonnummer/telefonnummer-og-den-norske-nummerplan/alle-nummerserier-for-norske-telefonnumre)
    tel: /^(?:[2-7,9]\d{7}|(?:\+|00)\d{6,})$/,
    // Aksepterer "normale" epost-adresser (https://www.regular-expressions.info/email.html)
    email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
}

// Forskjellige feilmeldinger basert på input
const errorMessage = {
    film: "Du må velge en film.",
    amount: "Du må velge antall mellom 1-99",
    name: "Du må skrive inn et navn.",
    tel: "Du må skrive inn et gyldig norsk telefonnummer.",
    email: "Du må skrive inn en gyldig epost-adresse."
}

// Funksjon som sjekker film-input
function checkFilm() {
    let inputOK = regEx.film.test($("#film").val());
    if (!inputOK) {
        $("#filmfeilmelding").html(errorMessage.film);
    } else {
        $("#filmfeilmelding").html("");
    }
    return inputOK;
}

// Funksjon som sjekker antall-input
function checkAmount() {
    let inputOK = regEx.amount.test($("#antall").val());
    if (!inputOK) {
        $("#antallfeilmelding").html(errorMessage.amount);
    } else {
        $("#antallfeilmelding").html("");
    }
    return inputOK;
}

// Funksjon som sjekker fornavn-input
function checkFirstname() {
    let inputOK = regEx.name.test($("#fornavn").val());
    if (!inputOK) {
        $("#fornavnfeilmelding").html(errorMessage.name);
    } else {
        $("#fornavnfeilmelding").html("");
    }
    return inputOK;
}

// Funksjon som sjekker etternavn-input
function checkLastname() {
    let inputOK = regEx.name.test($("#etternavn").val());
    if (!inputOK) {
        $("#etternavnfeilmelding").html(errorMessage.name);
    } else {
        $("#etternavnfeilmelding").html("");
    }
    return inputOK;
}

// Funksjon som sjekker telefonnummer-input
function checkTelephone() {
    let inputOK = regEx.tel.test($("#tlf").val());
    if (!inputOK) {
        $("#tlffeilmelding").html(errorMessage.tel);
    } else {
        $("#tlffeilmelding").html("");
    }
    return inputOK;
}

// Funksjon som sjekker epost-input
function checkEmail() {
    let inputOK = regEx.email.test($("#epost").val());
    if (!inputOK) {
        $("#epostfeilmelding").html(errorMessage.email);
    } else {
        $("#epostfeilmelding").html("");
    }
    return inputOK;
}

// Funksjonen går gjennom et array med funksjonene som skal sjekke RegEx
function checkForm() {
    let inputArray = [
        checkFilm(),
        checkAmount(),
        checkFirstname(),
        checkLastname(),
        checkTelephone(),
        checkEmail(),
    ]
    // Hvis alle verdier kommer tilbake som sanne blir checkForm-verdien også sann
    if (!inputArray.includes(false)) {
        return true;
    }
}

// Funksjon som lager en ny billett med input-data
function newTicket() {
    oneTicket = {
        film: $("#film  option:selected").text(),
        amount: $("#antall").val(),
        firstname: $("#fornavn").val(),
        lastname: $("#etternavn").val(),
        tel: $("#tlf").val(),
        email: $("#epost").val(),
    }
}

// Flytter objektet til billett-arrayet
function pushTicket() {
    tickets.push(oneTicket);
}

// Funksjon som viser info om billetter i billettarrayet
function showTickets() {
    // Begynner med å lage table head
    let ut = "<tr>" +
        "<th>Film</th><th>Antall</th><th>Navn</th><th>Etternavn</th><th>Telefonnr</th><th>Epost</th>" +
        "</tr>";
    // Så blir hver billett printet i en tabell gjennom en for-løkke
    for (let i of tickets) {
        ut += "<tr>";
        ut += "<td>" + i.film + "</td><td>" + i.amount + "</td><td>" + i.firstname + "</td><td>" + i.lastname + "</td><td>" + i.tel + "</td><td>" + i.email + "</td>";
        ut += "</tr>";
    }
    $("#liste").html(ut);
}

// Resetter skjemaet
function emptyForm() {
    $(".skjema").val("");
}

// En samlefunksjon som sjekker om regex-sjekk er ok, så lager ny billett med input, flytter billetten til arrayet,
// viser billett-array i konsoll-logg for debug, så printer en tabell med billettene, før den tømmer skjemadata.
// Hvis det kommer en feil i regex-sjekk vises det hvor det ble feil
function ticketPlease() {
    if (checkForm()) {
        newTicket();
        pushTicket();
        console.log(tickets);
        showTickets();
        emptyForm();
    } else {
        alert("Noe ble feil, sjekk skjema");
        //     Hadde en alert ved feil
    }
}

// Funksjon som sletter alle billetter (tømmer arrayet)
function deleteTickets() {
    tickets.length = 0;
    $("#liste").html("");
}

// Fyll ut info knapp, for å slippe å skrive inn hver eneste gang :) ----------------------------------------
function autoFillInfo() {
    const fornavnArray = ["Per", "Kari", "Ola", "Conan", "Anne", "Berit"];
    const etternavnArray = ["Pettersen", "Knutsen", "Olsen", "The Barbarian", "Andersen", "Berntsen"];
    const epostArray = ["epost@epost.no", "email@gmail.com", "hotmail@hotmail.com", "chunkylover53@aol.com", "secret@email.com", "notreal@oslomet.no"];
    const randomFornavn = fornavnArray[Math.floor(Math.random() * fornavnArray.length)];
    const randomEtternavn = etternavnArray[Math.floor(Math.random() * etternavnArray.length)];
    const randomEpost = epostArray[Math.floor(Math.random() * epostArray.length)];
    $("#film").val(Math.floor(Math.random() * (6) + 1));
    $("#antall").val(Math.floor(Math.random() * (99) + 1));
    $("#fornavn").val(randomFornavn);
    $("#etternavn").val(randomEtternavn);
    $("#tlf").val(Math.floor(Math.random() * (99999999 - 90000000 + 1)) + 90000000);
    $("#epost").val(randomEpost);
}