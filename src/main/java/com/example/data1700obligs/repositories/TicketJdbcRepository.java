package com.example.data1700obligs.repositories;

import com.example.data1700obligs.TicketJdbc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class TicketJdbcRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void saveTicket(TicketJdbc ticket) {
        String sql = "INSERT INTO ticketsjdbc (filmid, film, amount, firstname, lastname, tel, email) VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                ticket.getFilmid(), ticket.getFilm(), ticket.getAmount(), ticket.getFirstname(), ticket.getLastname(),
                ticket.getTel(), ticket.getEmail());
    }

    public List<TicketJdbc> getAllTicketsSorted() {
        String sql = "SELECT * FROM ticketsjdbc ORDER BY lastname ASC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            TicketJdbc ticket = new TicketJdbc();
            ticket.setId(rs.getLong("id"));
            ticket.setFilmid(rs.getInt("filmid"));
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

        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                TicketJdbc ticket = new TicketJdbc();
                ticket.setId(rs.getLong("id"));
                ticket.setFilm(rs.getString("film"));
                ticket.setAmount(rs.getInt("amount"));
                ticket.setFirstname(rs.getString("firstname"));
                ticket.setLastname(rs.getString("lastname"));
                ticket.setTel(rs.getString("tel"));
                ticket.setEmail(rs.getString("email"));
                return ticket;
            }, id));
        } catch (EmptyResultDataAccessException ex) {
            return Optional.empty();
        }
    }

    public void save(TicketJdbc ticket) {
        String sql = "UPDATE ticketsjdbc SET film = ?, amount = ?, firstname = ?, lastname = ?, tel = ?, email = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                ticket.getFilm(), ticket.getAmount(),
                ticket.getFirstname(), ticket.getLastname(),
                ticket.getTel(), ticket.getEmail(), ticket.getId());  // Important to include WHERE id = ?
    }
}