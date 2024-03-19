package com.example.data1700obligs;

import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

//from Gemini
//Your current setup doesn't seem to have explicit error-handling mechanisms.
// Implement error handling in your frontend to display user-friendly messages
// if a request to the backend fails. In your Spring controller, you might use
// try-catch blocks and return appropriate HTTP status codes (e.g., 400 for bad requests) and error messages.

@Validated
@RestController
public class AppController {
    private final ArrayList<Ticket> tickets = new ArrayList<>();

    @PostMapping("/tickets/add")
    public void addtoTicketsJava(@Valid Ticket oneTicket) {
        tickets.add(oneTicket);
    }

    @GetMapping("/tickets/list")
    public ArrayList<Ticket> showTickets() {
        return tickets;
    }

    @PostMapping("/tickets/clear")
    public void deleteTickets() {
        tickets.clear();
    }
}
