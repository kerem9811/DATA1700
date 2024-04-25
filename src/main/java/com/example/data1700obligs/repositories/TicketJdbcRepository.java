package com.example.data1700obligs.repositories;

import com.example.data1700obligs.TicketJdbc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class TicketJdbcRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void saveTicket(TicketJdbc ticket) {
        String sql = "INSERT INTO ticketsjdbc (film, amount, firstname, lastname, tel, email) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                ticket.getFilm(), ticket.getAmount(),
                ticket.getFirstname(), ticket.getLastname(),
                ticket.getTel(), ticket.getEmail());
    }

    public List<TicketJdbc> getAllTicketsSorted() {
        String sql = "SELECT * FROM ticketsjdbc ORDER BY lastname ASC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            TicketJdbc ticket = new TicketJdbc();
            ticket.setId(rs.getLong("id"));
            ticket.setFilm(rs.getString("film"));
            ticket.setAmount(rs.getInt("amount"));
            ticket.setFirstname(rs.getString("firstname"));
            ticket.setLastname(rs.getString("lastname"));
            ticket.setTel(rs.getString("tel"));
            ticket.setEmail(rs.getString("email"));
            return ticket;
        });
    }

    public void deleteAll() {
        String sql = "DELETE FROM ticketsjdbc";
        jdbcTemplate.update(sql);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM ticketsjdbc WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public Optional<TicketJdbc> findById(Long id) {
        String sql = "SELECT * FROM ticketsjdbc WHERE id = ?";
        return Optional.ofNullable(jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, rowNum) -> {
            TicketJdbc ticket = new TicketJdbc();
            ticket.setId(rs.getLong("id"));
            ticket.setFilm(rs.getString("film"));
            // ... (Set the rest of the fields)
            return ticket;
        }));
    }

    public void save(TicketJdbc ticket) {
        String sql = "UPDATE ticketsjdbc SET film = ?, amount = ?, firstname = ?, lastname = ?, tel = ?, email = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                ticket.getFilm(), ticket.getAmount(),
                ticket.getFirstname(), ticket.getLastname(),
                ticket.getTel(), ticket.getEmail(), ticket.getId());  // Important to include WHERE id = ?
    }
}