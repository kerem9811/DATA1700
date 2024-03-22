'use strict';
// Fra W3schools: "Strict mode makes it easier to write "secure" JavaScript. Strict mode changes previously accepted "bad syntax" into real errors."

$('document').ready(() => {

    $('#autofyll').click(autoFillInfo);
    $('#slettaltfront').click(clearTicketsFront);
    $('#slettaltback').click(clearTicketsBack);

    $('#orderform').submit(event => {
        event.preventDefault();
        checkForm().then(data => {
            if (data) {
                console.log("Validering av skjema er " + data);
                void addtoTickets();
                void addtoTicketsBackend();
            } else {
                alert("Du må sjekke input :(");
                console.log("Validering av skjema er " + data);
            }
        })
    })
    void updateTicketsBack();
    void updateTicketsFront();
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


    // Send billett to frontend with fetch for better error handling
    const responseFront = await fetch("/tickets/addfront", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(ticket),
    });

    if (!responseFront.ok) {
        console.error("Error saving ticket to frontend:", responseFront.statusText);
        alert("Error saving ticket to frontend. Please check your input.");
        return;  // Stop further execution if there's an error
    }

    // Legg billett til tabell
    await updateTicketsFront();
}
async function addtoTicketsBackend() {
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

    // Send billett to backend
    try {
         $.post("/tickets/addback", ticket);
    } catch (e) {
        console.error("Error saving ticket to backend:" + e);
    }

   /* const responseBack = await fetch("/tickets/addback", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(ticket),
    });

    if (!responseBack.ok) {
        console.error("Error saving ticket to backend:", responseBack.statusText);
        alert("Error saving ticket to backend. Please check your input.");
        return;
    }
*/
    // Legg billett til tabell
    await updateTicketsBack();
}

async function clearTicketsFront() {
    await $.post("/tickets/clearfront");
    await updateTicketsFront();
}

async function clearTicketsBack() {
    await $.post("/tickets/clearback");
    await updateTicketsBack();
}

async function updateTicketsFront() {
    // Få billetter fra frontend
    let tickets = await $.get("/tickets/listfront");
    console.log("Update frontend tickets " + JSON.stringify(tickets));

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
    console.log(ut);
}

async function updateTicketsBack() {
    // Få billetter fra backend
    let tickets = await $.get("/tickets/listback");
    console.log("Update backend tickets " + JSON.stringify(tickets));

    // Tømme tabell-body
    const table = $('#listeback');
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
    $("#listeback").html(ut);
    console.log(ut);
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
        $("#filmPopup").css({
            visibility: 'hidden',
            'z-index': 1
        });
    } else if ($("#film").val() === "") {
        $("#filmPopup").css({
            visibility: 'visible',
            'z-index': 10000
        });
    }
    return filmOK;
}

async function checkAmount() {
    let antallRegex = regEx.amount.test($("#antall").val());
    let antallValidity = document.getElementById('antall').checkValidity();
    let bothOK = false;
    if (!antallRegex || !antallValidity) {
        $("#antallPopup").css({
            visibility: 'visible',
            'z-index': 10000
        });
    } else {
        $("#antallPopup").css({
            visibility: 'hidden',
            'z-index': 1
        });
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
        $("#fornavnPopup").css({
            visibility: 'visible',
            'z-index': 10000
        });
    } else if (firstnameRegex && firstnameValidity) {
        $("#fornavnPopup").css({
            visibility: 'hidden',
            'z-index': 1
        });
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
        $("#etternavnPopup").css({
            visibility: 'visible',
            'z-index': 10000
        });
    } else if (lastnameRegex && lastnameValidity) {
        $("#etternavnPopup").css({
            visibility: 'hidden',
            'z-index': 1
        });
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
        $("#tlfPopup").css({
            visibility: 'visible',
            'z-index': 10000
        });
    } else if (telRegex && telValidity) {
        $("#tlfPopup").css({
            visibility: 'hidden',
            'z-index': 1
        });
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
        $("#epostPopup").css({
            visibility: 'hidden',
            'z-index': 1
        });
        bothOK = true;
    } else if (!emailRegex || !emailValidity) {
        $("#epostPopup").css({
            visibility: 'visible',
            'z-index': 10000
        });
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