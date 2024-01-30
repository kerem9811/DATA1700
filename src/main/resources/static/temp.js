// Begynner med å lage et array
let billetter = [];

// Funksjon som lager billetter med input fra tekstfeltet
function kjopBillett() {
    let film = document.getElementById("film").value;
    let antall = document.getElementById("antall").value;
    let fornavn = document.getElementById("fornavn").value;
    let etternavn = document.getElementById("etternavn").value;
    let telefonnr = document.getElementById("tlf").value;
    let epost = document.getElementById("epost").value;

    let inputerror = false;

    // If-setninger for å sjekke om det er skrevet noe i tekstfeltet, hvis ikke så vises feil-melding
    if (film === "Velg film her") {
        document.getElementById("filmfeilmelding").innerText = "Du må velge en film."
        inputerror = true;
    } else {
        document.getElementById("filmfeilmelding").value = "";
    }

    if (antall <= 0 || antall > 10) {
        document.getElementById("antallfeilmelding").innerText = "Antall må være mellom 1 og 10"
        inputerror = true;
    } else {
        document.getElementById("antallfeilmelding").value = "";
    }

    if (fornavn === "") {
        document.getElementById("navnfeilmelding").innerText = "Feltet kan ikke være tomt."
        inputerror = true;
    } else {
        document.getElementById("navnfeilmelding").value = "";
    }

    if (etternavn === "") {
        document.getElementById("etternavnfeilmelding").innerText = "Feltet kan ikke være tomt."
        inputerror = true;
    } else {
        document.getElementById("etternavnfeilmelding").value = "";
    }

    if (telefonnr <= 19999999 || telefonnr > 99999999) {
        document.getElementById("tlffeilmelding").innerText = "Ikke gyldig telefonnr."
        inputerror = true;
    } else {
        document.getElementById("tlffeilmelding").value = "";
    }

    if (epost === "") {
        document.getElementById("epostfeilmelding").innerText = "Feltet kan ikke være tomt."
        inputerror = true;
    } else {
        document.getElementById("epostfeilmelding").value = "";
    }

// Hvis det ikke er noen feil i bruker-input, lages en bestilling og felter blankes.
    if (inputerror === false) {
        const person = {
            film: film,
            antall: antall,
            fornavn: fornavn,
            etternavn: etternavn,
            telefonnr: telefonnr,
            epost: epost
        };
        billetter.push(person);

        document.getElementById("film").value = "Velg film her";
        document.getElementById("antall").value = "";
        document.getElementById("antall").innerText = "";
        document.getElementById("fornavn").value = "";
        document.getElementById("fornavn").innerText = "";
        document.getElementById("etternavn").value = "";
        document.getElementById("etternavn").innerText = "";
        document.getElementById("tlf").value = "";
        document.getElementById("tlf").innerText = "";
        document.getElementById("epost").value = "";
        document.getElementById("epost").innerText = "";

        document.getElementById("filmfeilmelding").value = "";
        document.getElementById("filmfeilmelding").innerText = "";
        document.getElementById("antallfeilmelding").value = "";
        document.getElementById("antallfeilmelding").innerText = "";
        document.getElementById("navnfeilmelding").value = "";
        document.getElementById("navnfeilmelding").innerText = "";
        document.getElementById("etternavnfeilmelding").value = "";
        document.getElementById("etternavnfeilmelding").innerText = "";
        document.getElementById("tlffeilmelding").value = "";
        document.getElementById("tlffeilmelding").innerText = "";
        document.getElementById("epostfeilmelding").value = "";
        document.getElementById("epostfeilmelding").innerText = "";
    }

// En funksjon som viser bestillingen som ble gjort
    function visKjop() {

        let ut = "<table id='table'><tr>" +
            "<th>Film</th><th>Antall</th><th>Navn</th><th>Etternavn</th><th>Telefonnr</th><th>Epost</th>" +
            "</tr>";
        for (let i of billetter) {
            ut += "<tr>";
            ut += "<td>" + i.film + "</td><td>" + i.antall + "</td><td>"
                + i.fornavn + "</td><td>" + i.etternavn + "</td><td>"
                + i.telefonnr + "</td><td>" + i.epost + "</td>";
            ut += "</tr>";
        }
        document.getElementById("liste").innerHTML = ut;
    }
    visKjop();
}

// Funksjon som sletter alle billetter (tømmer arrayet)
function slettAlt() {
    billetter.length = 0;
    document.getElementById("liste").innerHTML = "";
}