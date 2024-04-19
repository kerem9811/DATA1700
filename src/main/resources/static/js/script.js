'use strict';
// Fra W3schools: "Strict mode makes it easier to write "secure" JavaScript.
// Strict mode changes previously accepted "bad syntax" into real errors."

$('document').ready(async () => {
    // An autofill button for faster debugging
    $('#autofyll').click(function () {
        autoFillInfo();
        $('#updateTicketDiv').hide(); // Hide edit form
    });

    // Submit form button event
    $('#orderform').submit(async event => {
        // Prevent default behaviour, instead do as below.
        event.preventDefault();
        $('#updateTicketDiv').hide(); // Hide edit form
        // Check form validity on submit
        if (await checkForm()) {
            console.log("Validation succeeded!");
            // Wait for the ticket to be saved, then fetch updated tickets after saving
            try {
                await sendTicketBackend().then(getSortedBackend);
                // Clears the form after the ticket has been sent and the table has been propagated.
                await clearInputForm();
            } catch (error) {
                console.error("Failed to save or fetch tickets: ", error);
                alert("Error processing your request :(");
            }
        } else {
            alert("Du må sjekke input :(");
            console.log("Validation failed.");
        }
    });

    // Save edits button
    /*$('#save-edit-btn').click(async function () {*/
    $('#edit-orderform').submit(async event => {
        event.preventDefault();
        try {
            // Create data object
            let updatedTicket = createTicketObjectFromEditForm();
            // Change ticket in backend, then update table
            await updateTicketBackend(updatedTicket).then(getSortedBackend);
            // Hide edit form
            $('#updateTicketDiv').hide();
        } catch (error) {
            console.error("Error updating ticket:", error);
            alert("Error while saving edits. Please try again.");
        }
    });

    // Get data from the form
    function createTicketObjectFromEditForm() {
        const ticket = {};
        ticket.id = $('#edit-id').val();
        ticket.filmid = $('#edit-film option:selected').val();
        ticket.film = $('#edit-film option:selected').text();
        ticket.amount = $('#edit-antall').val();
        ticket.firstname = $('#edit-fornavn').val();
        ticket.lastname = $('#edit-etternavn').val();
        ticket.tel = $('#edit-tlf').val();
        ticket.email = $('#edit-epost').val();
        return ticket;
    }

    // Send updated data to backend (PUT request)
    async function updateTicketBackend(ticket) {
        await $.ajax({
            url: `/tickets/${ticket.id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(ticket)
        });
    }

    // Delete all tickets, then refresh table
    $('#slettaltback').on('click', async function () {
        await clearTicketsBackend();
        await getSortedBackend();
    });

// BACKEND --------------------------------------------------------------------------------------

//     Populate dropdown list with films from backend table.
    async function populateDropdown() {
        await $.getJSON("http://localhost:8080/films", function (films) {
            console.log("Received films for dropdown", films);
            $('#film').append('<option disabled selected value="">Velg film her</option>');
            $('#edit-film').append('<option disabled selected value="">Velg film her</option>');
            films.forEach(film => {
                $('#film').append(`<option value="${film.id}">${film.name}</option>`);
                $('#edit-film').append(`<option value="${film.id}">${film.name}</option>`);
            })
            // return films;
        }).fail(function (jqxhr, textStatus, error) {
            console.error("Error fetching films:", textStatus, error);
            alert("Failed to populate the dropdown with films. Try refreshing the page.");
        });
    }

//     Create ticket object and send it to the backend
    async function sendTicketBackend() {
        try {
            let ticket = await createTicketObject();
            await $.post("/tickets/addback", ticket);
            console.log("Ticket sent to backend!");
        } catch (e) {
            alert("Error saving ticket to backend: " + e);
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
                    .append('<th>&#128465;</th>')
                    .append('<th>&#x270D;</th>');
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
                    $table.append($row);

                    // Create the delete button for each ticket
                    const deleteButton = $(`<input class='btn btn-danger' type='button' value='&#128465;'>`);
                    // Create the edit button for each ticket
                    const editButton = $(`<input class='btn btn-info' type='button' value='&#x270D;'>`);

                    // Add the click handler directly to the button, using its ID
                    deleteButton.click(async function () {
                        await deleteTicketById(ticket.id); // Pass the ticket ID
                        await getSortedBackend();  // Refresh the table
                    });
                    // Add the click handler for editing
                    editButton.click(async function () {
                        $("#updateTicketDiv").show();
                        await editTicket(ticket.id);
                        $('#edit-film').val(ticket.filmid);
                    });
                    // await getSortedBackend();

                    // Add the button in its own cell
                    $row.append($('<td>').append(deleteButton));
                    $row.append($('<td>').append(editButton));
                    $table.append($row);
                }

                // Append the contents of table variable to the table in html.
                $('#listeback').html($table);
            }
        ).fail(function () {
            console.error("Failed to fetch ticket data.");
            alert("Feil med innhenting av billetter fra server :(");
        });
    }

// Clear the table contents
    async function clearTableBackend() {
        $('#listeback').html("");
    }

// Delete all tickets from backend
    async function clearTicketsBackend() {
        try {
            await $.ajax({
                url: "/tickets/clearback",
                type: "DELETE",
                success: function (data, textStatus, jqXHR) {
                    if (jqXHR.status === 204) {
                        console.log("Ticket deleted successfully!");
                    } else {
                        console.error("Error deleting ticket:", textStatus);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error deleting ticket:", errorThrown);
                }
            });
            await clearTableBackend();
            console.log("Deleted all tickets in backend :>");
            $("#updateTicketDiv").hide();
        } catch (error) {
            console.error("Error clearing tickets:", error);
        }
    }

// COMMON ----------------------------------------------------------------------
// Create ticket object with input data
    async function createTicketObject() {
        let ticket = {};
        ticket.filmid = $("#film  option:selected").val();
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
        $("#edit-orderform").trigger('reset');
    }

    // delete single ticket function
    async function deleteTicketById(id) {
        try {
            await $.ajax({
                url: "/tickets/deleteTicketById",
                type: 'DELETE',
                data: {id: id}
            });
            console.log("Ticket with ID " + id + " deleted successfully!");
            $("#updateTicketDiv").hide();
        } catch (error) {
            console.error("Error deleting ticket with ID " + id + ": ", error);
            alert("Error deleting ticket, please try again.");
        }
    }

    // Function to edit ticket
    async function editTicket(id) {
        try {
            let ticket = await $.getJSON(`/tickets/${id}`);

            // Populate form fields:
            $('#edit-id').val(ticket.id);
            $('#edit-filmid').val(ticket.filmid);
            $('#edit-film').val(ticket.film);
            $('#edit-antall').val(ticket.amount);
            $('#edit-fornavn').val(ticket.firstname);
            $('#edit-etternavn').val(ticket.lastname);
            $('#edit-tlf').val(ticket.tel);
            $('#edit-epost').val(ticket.email);

            // Show the edit form
            $("#updateTicketDiv").show();
        } catch
            (error) {
            console.error("Error fetching ticket with ID " + id + ": ", error);
            alert("Error editing ticket, please try again.");
        }
    }


// The dropdown is populated as the website loads
    try {
        await populateDropdown();
    } catch (e) {
        alert("Error populating dropdown: " + $.parseJSON(e));
    }
// If the website is reloaded while there are tickets in the db, this will show them in table.
    try {
        await getSortedBackend();
    } catch (e) {
        alert("Error fetching tickets from backend:" + $.parseJSON(e));
    }

    // Show alert for debugging
    alert("Document ready");
});


/*//////////---- ....End of document ready..... ----////////////////////////*/

// Input checking ----------------------------------------------------------------------------------
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