package com.example.data1700obligs;

import jakarta.validation.constraints.*;

public class Ticket {

    @NotBlank
    public String film;

    @Min(value = 1)
    @Max(value = 99)
    public Integer amount;

    @NotBlank
    public String firstname;

    @NotBlank
    public String lastname;

    @Pattern(regexp = "/^(?:[2-7,9]\\d{7}|(?:\\+|00)\\d{6,})$/")
    public String tel;

    /* Aksepterer "normale" epost-adresser (https://www.regular-expressions.info/email.html)*/
    @Pattern(regexp = "/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i")
    public String email;

    public Ticket(String film, Integer amount, String firstname, String lastname, String tel, String email) {
        this.film = film;
        this.amount = amount;
        this.firstname = firstname;
        this.lastname = lastname;
        this.tel = tel;
        this.email = email;
    }
}
