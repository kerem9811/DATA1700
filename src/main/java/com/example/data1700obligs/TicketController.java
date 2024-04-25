package com.example.data1700obligs;

import com.example.data1700obligs.repositories.TicketJdbcRepository;
import com.example.data1700obligs.repositories.TicketRepository;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Optional;

@Validated
@RestController
public class TicketController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private TicketJdbcRepository ticketJdbcRepository;

    @Autowired
    private TicketRepository ticketRepository;

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
    @PostMapping("tickets/addbackJdbc")
    public ResponseEntity<Void> saveTicket(TicketJdbc oneTicket) {
        try {
            ticketJdbcRepository.saveTicket(oneTicket);
            System.out.println("Ticket saved in Jdbc backend :)" + oneTicket);
            return ResponseEntity.ok().build();  // 200 OK - Success
        } catch (Exception e) {
            System.out.println("Error saving ticket in Jdbc backend :(" + e.getMessage());
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
    @GetMapping("/tickets/allSortedJdbc")
    public ResponseEntity<?> getAllTicketsSortedJdbc() {
        try {
            List<TicketJdbc> sortedTickets = ticketJdbcRepository.getAllTicketsSorted();
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
    @DeleteMapping("/tickets/clearbackJdbc")
    public ResponseEntity<Void> deleteTicketsBackJdbc() {
        try {
            ticketJdbcRepository.deleteAll();
            System.out.println("Success deleting all tickets :)");
            return ResponseEntity.noContent().build();  // 204 No Content
        } catch (Exception e) {
            System.out.println("Error deleting tickets: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("tickets/deleteTicketById")
    public ResponseEntity<Void> deleteTicketById(@RequestParam("id") Long id) {
        try {
            ticketRepository.deleteById(id);
            System.out.println("Ticket with id " + id + " deleted :)");
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (EmptyResultDataAccessException e) {
            System.err.println("Error deleting ticket by id: " + id + " - Ticket may not exist."); // Error logging
            return ResponseEntity.notFound().build(); // 404 Not Found
        } catch (Exception e) {
            System.out.println("Error deleting ticket by id: " + e.getMessage()); // Error logging
            return ResponseEntity.internalServerError().build();
        }
    }
    @DeleteMapping("tickets/deleteTicketByIdJdbc")
    public ResponseEntity<Void> deleteTicketByIdJdbc(@RequestParam("id") Long id) {
        try {
            ticketJdbcRepository.deleteById(id);
            System.out.println("Ticket with id " + id + " deleted :)");
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (EmptyResultDataAccessException e) {
            System.err.println("Error deleting ticket by id: " + id + " - Ticket may not exist."); // Error logging
            return ResponseEntity.notFound().build(); // 404 Not Found
        } catch (Exception e) {
            System.out.println("Error deleting ticket by id: " + e.getMessage()); // Error logging
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/tickets/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        Optional<Ticket> ticket = ticketRepository.findById(id);
        return ticket.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/ticketsJdbc/{id}")
    public ResponseEntity<TicketJdbc> getTicketByIdJdbc(@PathVariable Long id) {
        Optional<TicketJdbc> ticket = ticketJdbcRepository.findById(id);
        return ticket.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/tickets/{id}")
    public ResponseEntity<Void> updateTicketById(@PathVariable Long id, @RequestBody Ticket updatedTicket) {
        Optional<Ticket> ticketToUpdate = ticketRepository.findById(id);
        if (ticketToUpdate.isPresent()) {
            Ticket ticket = ticketToUpdate.get();

            // Update the ticket fields:
            ticket.setFilm(updatedTicket.getFilm());
            ticket.setAmount(updatedTicket.getAmount());
            ticket.setFirstname(updatedTicket.getFirstname());
            ticket.setLastname(updatedTicket.getLastname());
            ticket.setTel(updatedTicket.getTel());
            ticket.setEmail(updatedTicket.getEmail());

            ticketRepository.save(ticket);
            return ResponseEntity.ok().build(); // 200 OK
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/ticketsJdbc/{id}")
    public ResponseEntity<Void> updateTicketByIdJdbc(@PathVariable Long id, @RequestBody TicketJdbc updatedTicket) {
        Optional<TicketJdbc> ticketToUpdate = ticketJdbcRepository.findById(id);
        if (ticketToUpdate.isPresent()) {
            TicketJdbc ticket = ticketToUpdate.get();

            // Update the ticket fields:
            ticket.setFilm(updatedTicket.getFilm());
            ticket.setAmount(updatedTicket.getAmount());
            ticket.setFirstname(updatedTicket.getFirstname());
            ticket.setLastname(updatedTicket.getLastname());
            ticket.setTel(updatedTicket.getTel());
            ticket.setEmail(updatedTicket.getEmail());

            ticketJdbcRepository.save(ticket);
            return ResponseEntity.ok().build(); // 200 OK
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Test
    public void testSaveTicketJdbc() {
        TicketJdbc ticket = new TicketJdbc();
        ticket.setFilm("The Godfather");
        ticket.setAmount(2);
        ticket.setFirstname("Knut");
        ticket.setLastname("Knuttsen");
        ticket.setTel("12345678");
        ticket.setEmail("john.c.breckinridge@altostrat.com");
        ticketJdbcRepository.saveTicket(ticket);
    }
}