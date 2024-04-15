package com.example.data1700obligs;


import com.example.data1700obligs.repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public void saveTicket(Ticket oneTicket) {
        try {
            ticketRepository.save(oneTicket);
            System.out.println("Ticket saved in backend :)" + oneTicket);
        } catch (Exception e) {
            System.out.println("Error saving ticket in backend :(" + e.getMessage());
        }
    }

    @GetMapping("/tickets/allSorted")
    public List<Ticket> getAllTicketsSorted() {
        try {
            List<Ticket> sortedTickets = ticketRepository.findAllByOrderByLastnameAsc();
            System.out.println("Returned all tickets :)");
            return sortedTickets;
        } catch (Exception e) {
            System.out.println("Error returning tickets :(" + e.getMessage());
            return null;
        }
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

    @PostMapping("deleteTicketById")
    public void deleteTicketById(Long id) {
        try {
            ticketRepository.deleteById(id);
            System.out.println("Ticket with id " + id + " deleted :)");
        } catch (Exception e) {
            System.out.println("Error deleting ticket by id: " + e.getMessage());
        }
    }
}