package com.example.data1700obligs;

import com.example.data1700obligs.repositories.FilmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FilmController {

//    "Field Injection not recommended"
   /* @Autowired
    FilmRepository filmrep;*/

    private final FilmRepository filmRepository;

    public FilmController(FilmRepository filmRepository) {
        this.filmRepository = filmRepository;
    }

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