package com.example.data1700obligs;

import com.example.data1700obligs.repositories.TicketRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@Validated
@RestController
public class AppController {

    // FRONTEND --------------------------------------------------------------------------------
    private final ArrayList<Ticket> tickets = new ArrayList<>();

    @Autowired
    private TicketRepository ticketRepository;

    @PostMapping("/tickets/addfront")
    public ResponseEntity<?> addtoTicketsJavaFront(@Valid @RequestBody Ticket oneTicket) {
        try {
            tickets.add(oneTicket);
            return ResponseEntity.ok("Ticket saved in frontend");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error from AppController when saving frontend ticket: " + e.getMessage());
        }
    }

    @GetMapping("/tickets/listfront")
    public ArrayList<Ticket> showTicketsFront() { // Frontend tickets
        return tickets;
    }

    @PostMapping("/tickets/clearfront")
    public void deleteTicketsFront() {
        tickets.clear();
    }

    //    BACKEND -------------------------------------------------------------------------------
    @PostMapping("tickets/addback")
    public void saveTicket(Ticket oneTicket) {
        try {
            ticketRepository.save(oneTicket);
            System.out.println("Ticket saved in backend :)" + oneTicket);
        } catch (Exception e) {
            System.out.println("Error saving ticket in backend :(" + e.getMessage());
        }
    }
/*

    @GetMapping("/tickets/listback")
    public List<Ticket> showTicketsBack() {
        try {
            System.out.println("Returned all tickets :)");
            return ticketRepository.findAll();
        } catch (Exception e) {
            System.out.println("Error returning tickets :(" + e.getMessage());
            return null;
        }
    }
*/

    @GetMapping("/tickets/allSorted")
    public ResponseEntity<?> getAllTicketsSorted() {
        try {
            List<Ticket> sortedTickets = ticketRepository.findAllByOrderByLastnameAsc();
            return ResponseEntity.ok(sortedTickets); // Return a 200 OK response with the tickets
        } catch (Exception e) {
            System.out.println("Error returning tickets :(" + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    @GetMapping("/tickets/listback")
    public List<Ticket> showTicketsBack() {
        List<Ticket> unsortedTickets = null;
        try {
            unsortedTickets =  ticketRepository.findAll();
            System.out.println("Returned all tickets :)");
        } catch (Exception e) {
            System.out.println("Error returning tickets :(" + e.getMessage());
            return unsortedTickets;
        }
        return unsortedTickets;
    }

    @PostMapping("/tickets/clearback")
    public void deleteTicketsBack() {
        try {
            ticketRepository.deleteAll();
            System.out.println("Success deleting tickets :)");
        } catch (Exception e) {
            System.out.println("Error deleting tickets: " + e.getMessage());
        }
    }
}