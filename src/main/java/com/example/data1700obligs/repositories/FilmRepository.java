package com.example.data1700obligs.repositories;

import com.example.data1700obligs.Film;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilmRepository extends JpaRepository<Film, Long>{
    List<Film> findAllByNameOrderByName();
}
