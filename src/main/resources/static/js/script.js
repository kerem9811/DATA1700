'use strict';
// Fra W3schools: "Strict mode makes it easier to write "secure" JavaScript. Strict mode changes previously accepted "bad syntax" into real errors."

// from Gemini
// Consider enhancing your script.js with more robust frontend validation
// (e.g., using regular expressions) to provide immediate feedback to the user
// and reduce unnecessary backend calls.
$('document').ready(() => {

    $('#autofyll').click(autoFillInfo);
    $('#slettalt').click(deleteTicketsNew);

    $('#orderform').submit(event => {
        event.preventDefault();
        checkForm().then(data => {
            if (data) {
                console.log("Validering av skjema er " + data);
                void addtoTickets();
            } else {
                alert("Du må sjekke input :(");
                console.log("Validering av skjema er " + data);
            }
        })
    })
    void refreshTicketlist();
})

async function addtoTickets() {
    // Lage billett-objekt med tilhørende verdier
    let ticket = {};
    ticket.film = $("#film  option:selected").text();
    ticket.amount = $("#antall").val();
    ticket.firstname = $("#fornavn").val();
    ticket.lastname = $("#etternavn").val();
    ticket.tel = $("#tlf").val();
    ticket.email = $("#epost").val();

    // Tømme skjema
    $("#orderform").trigger('reset');

    // Send billett til backend
    await $.post("/tickets/add", ticket);

    // Legg billett til tabell
    await refreshTicketlist();
}

async function deleteTicketsNew() {
    await $.post("/tickets/clear");
    await refreshTicketlist();
}

async function refreshTicketlist() {
    // Få billetter fra backend
    let tickets = await $.get("/tickets/list");

    // Tømme tabell-body
    const table = $('#liste');
    table.empty();

    // Sende billetter til tabell
    let ut = null;
    let nr = 1;
    ut += "<tr>" +
        "<th>Nr</th><th>Film</th><th>Antall</th><th>Fornavn</th><th>Etternavn</th><th>Telefonnr</th><th>Epost</th>" +
        "</tr>";
    // Så blir hver billett printet i en tabell gjennom en for-løkke
    for (let i of tickets) {
        ut += "<tr>";
        ut += "<td>" + nr + "<td>" + i.film + "</td><td>" + i.amount + "</td><td>" + i.firstname + "</td><td>" + i.lastname + "</td><td>" + i.tel + "</td><td>" + i.email + "</td>";
        ut += "</tr>";
        nr++;
    }
    $("#liste").html(ut);
}

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

async function checkFilm() {
    let filmOK = false;
    if ($("#film").val() !== "") {
        filmOK = true;
        $("#filmPopup").css("visibility", "hidden");
        $("#filmPopup").css("z-index", 1);
    } else if ($("#film").val() === "") {
        $("#filmPopup").css("visibility", "visible");
        $("#filmPopup").css("z-index", 10000);
    }
    return filmOK;
}

async function checkAmount() {
    let antallRegex = regEx.amount.test($("#antall").val());
    let antallValidity = document.getElementById('antall').checkValidity();
    let bothOK = false;
    if (!antallRegex || !antallValidity) {
        $("#antallPopup").css("visibility", "visible");
        $("#antallPopup").css("z-index", 10000);
    } else {
        $("#antallPopup").css("visibility", "hidden");
        $("#antallPopup").css("z-index", 1);
        bothOK = true;
    }
    return bothOK;
}

// Funksjon som sjekker fornavn-input
async function checkFirstname() {
    let firstnameRegex = regEx.name.test($("#fornavn").val());
    let firstnameValidity = document.getElementById('fornavn').checkValidity();
    let bothOK = false;
    if (!firstnameRegex || !firstnameValidity) {
        $("#fornavnPopup").css("visibility", "visible");
        $("#fornavnPopup").css("z-index", 10000);
    } else if (firstnameRegex && firstnameValidity) {
        $("#fornavnPopup").css("visibility", "hidden");
        $("#fornavnPopup").css("z-index", 1);
        bothOK = true;
    }
    return bothOK;
}

// Funksjon som sjekker etternavn-input
async function checkLastname() {
    let lastnameRegex = regEx.name.test($("#etternavn").val());
    let lastnameValidity = document.getElementById('etternavn').checkValidity();
    let bothOK = false;
    if (!lastnameRegex || !lastnameValidity) {
        $("#etternavnPopup").css("visibility", "visible");
        $("#etternavnPopup").css("z-index", 10000);
    } else if (lastnameRegex && lastnameValidity) {
        $("#etternavnPopup").css("visibility", "hidden");
        $("#etternavnPopup").css("z-index", 1);
        bothOK = true;
    }
    return bothOK;
}

// Sjekker telefon-input
async function checkTelephone() {
    let telRegex = regEx.tel.test($("#tlf").val());
    let telValidity = document.getElementById('tlf').checkValidity();
    let bothOK = false;
    if (!telRegex || !telValidity) {
        $("#tlfPopup").css("visibility", "visible");
        $("#tlfPopup").css("z-index", 10000);
    } else if (telRegex && telValidity) {
        $("#tlfPopup").css("visibility", "hidden");
        $("#tlfPopup").css("z-index", 1);
        bothOK = true;
    }
    return bothOK;
}

// Sjekker epost-input
async function checkEmail() {
    let emailRegex = regEx.email.test($("#epost").val());
    let emailValidity = document.getElementById('epost').checkValidity();
    let bothOK = false;
    if (emailRegex && emailValidity) {
        $("#epostPopup").css("visibility", "hidden");
        $("#epostPopup").css("z-index", 1);
        bothOK = true;
    } else if (!emailRegex || !emailValidity) {
        $("#epostPopup").css("visibility", "visible");
        $("#epostPopup").css("z-index", 10000);
    }
    return bothOK;
}

async function checkForm() {
    let validationFunctionsArray = [
        await checkFilm(),
        await checkAmount(),
        await checkFirstname(),
        await checkLastname(),
        await checkTelephone(),
        await checkEmail(),
    ]
    // Hvis alle verdier kommer tilbake som sanne blir total-verdien også sann
    return !validationFunctionsArray.includes(false);
}

// Fyll ut info knapp, for å slippe å skrive inn hver eneste gang :) ----------------------------------------
async function autoFillInfo() {
    const fornavnArray = ["Per", "Kari", "Ola", "Conan", "Anne", "Berit", "Ken", "Alexander", "Bård", "Thomas"];
    const etternavnArray = ["Pettersen", "Knutsen", "Olsen", "The Barbarian", "Andersen", "Berntsen", "Linga", "Lønning", "Remen"];
    const epostArray = ["epost@epost.no", "email@gmail.com", "hotmail@hotmail.com", "chunkylover53@aol.com", "secret@email.com", "notreal@oslomet.no", "gator@mac.com", "yruan@verizon.net", "mschilli@msn.com"];
    const randomFornavn = fornavnArray[Math.floor(Math.random() * fornavnArray.length)];
    const randomEtternavn = etternavnArray[Math.floor(Math.random() * etternavnArray.length)];
    const randomEpost = epostArray[Math.floor(Math.random() * epostArray.length)];
    $("#film").val(Math.floor(Math.random() * (9) + 1));

    // Velger det minste tallet fra et array med 10 tilfeldig genererte tall, for litt billettkjøp-realisme.
    $("#antall").val(Math.ceil(Math.min(...Array.from({length: 10}, Math.random)) * 100));
    $("#fornavn").val(randomFornavn);
    $("#etternavn").val(randomEtternavn);
    let oneortwo = Math.floor(Math.random() * (2) + 1);
    switch (oneortwo) {
        case 1:
            $("#tlf").val(Math.floor(Math.random() * (99999999 - 90000000 + 1)) + 90000000);
            break;
        case 2:
            $("#tlf").val(Math.floor(Math.random() * (49999999 - 40000000 + 1)) + 40000000);
            break;
    }
    $("#epost").val(randomEpost);
}