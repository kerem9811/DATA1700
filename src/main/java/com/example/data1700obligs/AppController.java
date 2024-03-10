package com.example.data1700obligs;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@Validated
@RestController
public class AppController implements ErrorController {
    private final ArrayList<Ticket> tickets = new ArrayList<>();

    @PostMapping("/tickets/add")
    public void addTickets(@Valid Ticket oneTicket) {
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

    @RequestMapping("/error")
    public String errorHandler(HttpServletResponse response) {
        return "<img style=\"display:block;margin:auto\" " +
                "src=\"https://http.cat/" + response.getStatus() + "\">";
    }
}
