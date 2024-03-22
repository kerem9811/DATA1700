package com.example.data1700obligs.repositories;

import com.example.data1700obligs.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
}
