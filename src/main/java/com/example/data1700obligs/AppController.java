package com.example.data1700obligs;

import com.example.data1700obligs.repositories.TicketRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private TicketRepository ticketRepository;

    private final ArrayList<Ticket> tickets = new ArrayList<>();

   @PostMapping("/tickets/addfront")
   public ResponseEntity<?> addtoTicketsJavaFront(@Valid @RequestBody Ticket oneTicket) {
       try {
           tickets.add(oneTicket);
           return ResponseEntity.ok("Ticket saved in frontend");
       } catch (Exception e) {
           return ResponseEntity.badRequest().body("Error saving frontend ticket: " + e.getMessage());
       }
   }
    @PostMapping("/tickets/addback")
    public ResponseEntity<?> addtoTicketsJavaBack(@Valid Ticket oneTicket) {
        try {
            ticketRepository.save(oneTicket);
            return ResponseEntity.ok("Ticket saved in db");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving ticket in db: " + e.getMessage());
        }
    }

    @GetMapping("/tickets/listfront")
    public ArrayList<Ticket> showTicketsFront() { // Frontend tickets
        return tickets;
    }
    @GetMapping("/tickets/listback")
    public List<Ticket> showTicketsBack() { // Changed return type to List
        return ticketRepository.findAll(); // Use the repository to get all tickets
    }

    @PostMapping("/tickets/clearfront")
    public void deleteTicketsFront() {
        tickets.clear();
    }

    @PostMapping("/tickets/clearback")
    public void deleteTicketsBack() {
        ticketRepository.deleteAll();
    }
}
