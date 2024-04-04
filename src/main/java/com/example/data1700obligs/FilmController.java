package com.example.data1700obligs;

import com.example.data1700obligs.repositories.FilmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin(origins = "http://localhost:8080")
@RestController
//@RequestMapping("/films")
public class FilmController {

    @Autowired
    private FilmRepository filmRepository;

    @GetMapping("/films")
    public List<Film> getAllFilms() {
        try {
            List<Film> films = filmRepository.findAllByOrderById();
            System.out.println("Success getting film list ");
            return films;
        } catch (Exception e) {
            System.out.println("Error getting film list " + e.getMessage());
            return null;
        }
    }
}