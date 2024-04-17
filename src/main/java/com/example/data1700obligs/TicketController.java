package com.example.data1700obligs;


import com.example.data1700obligs.repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Validated
@RestController
public class TicketController {

    //    BACKEND -------------------------------------------------------------------------------
    private final TicketRepository ticketRepository;

    public TicketController(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @PostMapping("tickets/addback")
    public ResponseEntity<Void> saveTicket(Ticket oneTicket) {
        try {
            ticketRepository.save(oneTicket);
            System.out.println("Ticket saved in backend :)" + oneTicket);
            return ResponseEntity.ok().build();  // 200 OK - Success
        } catch (Exception e) {
            System.out.println("Error saving ticket in backend :(" + e.getMessage());
            return ResponseEntity.internalServerError().build();  // 500 Internal Server Error
        }
    }

    @GetMapping("/tickets/allSorted")
    public ResponseEntity<?> getAllTicketsSorted() { // Changed return type
        try {
            List<Ticket> sortedTickets = ticketRepository.findAllByOrderByLastnameAsc();
            System.out.println("Returned all tickets :)");
            return ResponseEntity.ok(sortedTickets);  // 200 OK + list of tickets in the body
        } catch (Exception e) {
            System.out.println("Error returning tickets :(" + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/tickets/clearback")
    public ResponseEntity<Void> deleteTicketsBack() {
        try {
            ticketRepository.deleteAll();
            System.out.println("Success deleting all tickets :)");
            return ResponseEntity.noContent().build();  // 204 No Content
        } catch (Exception e) {
            System.out.println("Error deleting tickets: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("tickets/deleteTicketById")
    public void deleteTicketById(Long id) {
        try {
            ticketRepository.deleteById(id);
            System.out.println("Ticket with id " + id + " deleted :)");
        } catch (Exception e) {
            System.out.println("Error deleting ticket by id: " + e.getMessage());
        }
    }
}