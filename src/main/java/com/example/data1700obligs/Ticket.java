package com.example.data1700obligs;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Integer filmid;

    @NotBlank
    private String film;

    @Min(value = 1)
    @Max(value = 99)
    private Integer amount;

    @NotBlank
    private String firstname;

    @NotBlank
    private String lastname;

    //    Aksepterer norske tlf-nummer som begynner med 2-7 eller 9, evt. utenlandske tlf
    @Pattern(regexp = "^(?:[2-7,9]\\d{7}|(?:\\+|00)\\d{6,})$")
    private String tel;

    //     Aksepterer "normale" epost-adresser (https://www.regular-expressions.info/email.html)
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")
    private String email;

    public Ticket() {
    }
}