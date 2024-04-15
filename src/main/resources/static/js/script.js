'use strict';
// Fra W3schools: "Strict mode makes it easier to write "secure" JavaScript.
// Strict mode changes previously accepted "bad syntax" into real errors."

$('document').ready(async () => {
    // An autofill button for faster debugging
    $('#autofyll').click(autoFillInfo);

    // Submit form button event
    $('#orderform').submit(async event => {
        // Prevent default behaviour, instead do as below.
        event.preventDefault();
        // Check form validity on submit
        if (await checkForm()) {
            console.log("Validation succeeded!");
            // Wait for the ticket to be saved, then fetch updated tickets after saving
            sendTicketBackend().then(getSortedBackend);
            try {
                // Clears the form after the ticket has been sent and the table has been propagated.
                await clearInputForm();
            } catch (error) {
                console.error("Failed to save or fetch tickets", error);
                alert("Error processing your request :(");
            }
        } else {
            alert("Du må sjekke input :(");
            console.log("Validation failed.");
        }
    })
    $('#slettaltback').click(clearTicketsBackend);

// BACKEND --------------------------------------------------------------------------------------

//     Populate dropdown list with films from backend table.
    async function populateDropdown() {
        await $.getJSON("http://localhost:8080/films", function (films) {
            console.log("Received films for dropdown", films);
            $('#film').append('<option disabled selected value="">Velg film her</option>');
            films.forEach(film => {
                $('#film').append(`<option value="${film.id}">${film.name}</option>`);
            });
        }).fail(function (jqxhr, textStatus, error) {
            console.error("Error fetching films:", textStatus, error);
            // alert("Failed to populate the dropdown. Check the console logs for errors.");
        });
    }

//     Create ticket object and send it to the backend
    async function sendTicketBackend() {
        try {
            let ticket = await createTicketObject();
            await $.post("/tickets/addback", ticket);
        } catch (e) {
            alert("Error saving ticket to backend:" + e);
            console.error("Error saving ticket to backend:" + e);
            throw e;
        }
    }

    // Get the tickets sorted from backend and put into table
    async function getSortedBackend() {
        await $.getJSON("/tickets/allSorted", function (tickets) {
            console.log('Backend tickets received:', tickets);

            const $table = $('<table>').addClass('tftable');
            const $headerRow = $('<tr>');

            // Add header columns
            $headerRow.append('<th>Fornavn</th>')
                .append('<th>Antall</th>')
                .append('<th>Fornavn</th>')
                .append('<th>Etternavn</th>')
                .append('<th>Telefonnummer</th>')
                .append('<th>Epost</th>')
                .append('<th>X</th>');
            $table.append($headerRow);

            // Add ticket data rows
            for (const ticket of tickets) { // Use 'for...of' loop for array iteration
                const $row = $('<tr>');
                $row.append(`<td>${ticket.film}</td>`)
                    .append(`<td>${ticket.amount}</td>`)
                    .append(`<td>${ticket.firstname}</td>`)
                    .append(`<td>${ticket.lastname}</td>`)
                    .append(`<td>${ticket.tel}</td>`)
                    .append(`<td>${ticket.email}</td>`)
                    .append(`<td><input class='btn btn-danger' id='ticket${ticket.id}' type='button' value='X'></td>`);
                $table.append($row);
            }
            /*
//Delete single ticket from db
async function deleteTicketById(id) {
   let ticketId = $('#id').val;
   $('#ticketId').click(ticketId);
   await $.post("/tickets/deleteTicketById", ticketId);
   await getSortedBackend();
}
await $('#id').click(deleteTicketById($('#id').val));*/
            /*let ticketId = ticket.id;
            onclick = "deleteTicketById(ticketId)"

            async function deleteTicketById(id) {
                await $.post("/tickets/deleteTicketById", ticketId);
                await getSortedBackend();
            }*/

            $('#listeback').html($table);

            function addRowHandlers() {
                let table = document.getElementById("listeback");
                let rows = table.getElementsByClassName("btn btn-danger");
                /*for (const ticket of tickets) {*/
                for (const button of rows){
                    let currentRow = table.rows[]

                    // TODO legg til funksjon for å slette enkeltbillett. Midt i en for loop .
                }
                for (i = 0; i < rows.length; i++) {
                    var currentRow = table.rows[i];
                    var createClickHandler =
                        function (row) {
                            return function () {
                                var cell = row.getElementsByTagName("td")[0];
                                var id = cell.innerHTML;
                                alert("id:" + id);
                            };
                        };

                    currentRow.onclick = createClickHandler(currentRow);
                }
            }

            window.onload = addRowHandlers();


        }).fail(function () {
            console.error("Failed to fetch ticket data.");
            alert("Feil med innhenting av billetter fra server :(");
        });
    }

    // Clear the table contents
    async function clearTableBackend() {
        $('#listeback').html("");
    }

    // Delete the tickets in backend and then clear table
    async function clearTicketsBackend() {
        await $.post("/tickets/clearback");
        /*await $.ajax("/tickets/clearback", function () {
            delete
        })*/
        await clearTableBackend();
        await console.log("Deleted tickets in backend :>")
    }


// COMMON ----------------------------------------------------------------------

    async function createTicketObject() {
        // Lage billett-objekt med tilhørende verdier
        let ticket = {};
        ticket.film = $("#film  option:selected").text();
        ticket.amount = $("#antall").val();
        ticket.firstname = $("#fornavn").val();
        ticket.lastname = $("#etternavn").val();
        ticket.tel = $("#tlf").val();
        ticket.email = $("#epost").val();
        return ticket;
    }

    async function clearInputForm() {
        $("#orderform").trigger('reset');
    }

    // The dropdown is populated as the website loads
    try {
        await populateDropdown();
    } catch (e) {
        alert("Error populating " + $.parseJSON(e));
    }
    // If the website is reloaded while there are tickets in the db, this will show them in table.
    try {
        await getSortedBackend();
    } catch (e) {
        alert("Error fetching tickets from backend:" + $.parseJSON(e));
    }
    alert("Document ready");

}); /*//////////---- ....End of document ready..... ----////////////////////////*/

// Sjekking av input ----------------------------------------------------------------------------------

// Sjekking av regex
const regEx = {
    // Det må velges en film
    film: /[^ ]/, // Antall må være 1-99
    amount: /^[1-9][0-9]?$/, // Kan ikke stå tom, har også required tag i html. (https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/)
    name: /^(?!\s*$).+/i, // Aksepterer nummer med 8 siffer som begynner med 2-7 eller 9, eller et internasjonalt nummer med minimum 6 siffer. (https://nkom.no/telefoni-og-telefonnummer/telefonnummer-og-den-norske-nummerplan/alle-nummerserier-for-norske-telefonnumre)
    tel: /^(?:[2-7,9]\d{7}|(?:\+|00)\d{6,})$/, // Aksepterer "normale" epost-adresser (https://www.regular-expressions.info/email.html)
    email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
}

async function checkFilm() {
    let filmOK = false;
    if ($("#film").val() !== "") {
        filmOK = true;
        $("#filmPopup").css({
            visibility: 'hidden', 'z-index': 1
        });
    } else if ($("#film").val() === "") {
        $("#filmPopup").css({
            visibility: 'visible', 'z-index': 10000
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
            visibility: 'visible', 'z-index': 10000
        });
    } else {
        $("#antallPopup").css({
            visibility: 'hidden', 'z-index': 1
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
            visibility: 'visible', 'z-index': 10000
        });
    } else if (firstnameRegex && firstnameValidity) {
        $("#fornavnPopup").css({
            visibility: 'hidden', 'z-index': 1
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
            visibility: 'visible', 'z-index': 10000
        });
    } else if (lastnameRegex && lastnameValidity) {
        $("#etternavnPopup").css({
            visibility: 'hidden', 'z-index': 1
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
            visibility: 'visible', 'z-index': 10000
        });
    } else if (telRegex && telValidity) {
        $("#tlfPopup").css({
            visibility: 'hidden', 'z-index': 1
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
    if (!emailRegex || !emailValidity) {
        $("#epostPopup").css({
            visibility: 'visible', 'z-index': 10000
        });
    } else if (emailRegex && emailValidity) {
        $("#epostPopup").css({
            visibility: 'hidden', 'z-index': 1
        });
        bothOK = true;
    }
    return bothOK;
}

async function checkForm() {
    // Et array av alle validitets-sjekker
    let validationFunctionsArray = [await checkFilm(), await checkAmount(), await checkFirstname(), await checkLastname(), await checkTelephone(), await checkEmail(),]
    // Hvis alle verdier kommer tilbake som sanne blir total-verdien også sann
    return !validationFunctionsArray.includes(false);
}

// Fyll ut info knapp, for å slippe å skrive inn hver eneste gang :)
async function autoFillInfo() {
    const fornavnArray = ["Per", "Kari", "Ola", "Conan", "Anne", "Berit", "Ken", "Alexander", "Bård", "Thomas"];
    const etternavnArray = ["Pettersen", "Knutsen", "Olsen", "The Barbarian", "Andersen", "Berntsen", "Linga", "Lønning", "Remen"];
    const epostArray = ["epost@epost.no", "email@gmail.com", "hotmail@hotmail.com", "chunkylover53@aol.com", "secret@email.com", "notreal@oslomet.no", "gator@mac.com", "yruan@verizon.net", "mschilli@msn.com"];
    const randomFornavn = fornavnArray[Math.floor(Math.random() * fornavnArray.length)];
    const randomEtternavn = etternavnArray[Math.floor(Math.random() * etternavnArray.length)];
    const randomEpost = epostArray[Math.floor(Math.random() * epostArray.length)];
    await $("#film").val(Math.floor(Math.random() * (9) + 1));
    // Velger det minste tallet fra et array med 15 tilfeldig genererte tall, for litt billettkjøp-realisme.
    await $("#antall").val(Math.ceil(Math.min(...Array.from({length: 15}, Math.random)) * 100));
    await $("#fornavn").val(randomFornavn);
    await $("#etternavn").val(randomEtternavn);
    let oneortwo = Math.floor(Math.random() * (2) + 1);
    switch (oneortwo) {
        case 1:
            $("#tlf").val(Math.floor(Math.random() * (99999999 - 90000000 + 1)) + 90000000);
            break;
        case 2:
            $("#tlf").val(Math.floor(Math.random() * (49999999 - 40000000 + 1)) + 40000000);
            break;
    }
    await $("#epost").val(randomEpost);
}