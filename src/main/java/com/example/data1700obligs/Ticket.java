package com.example.data1700obligs;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class Ticket {

    @NotBlank
    private String film;

    @Min(value = 1)
    @Max(value = 99)
    private Integer amount;

    @NotBlank
    private String firstname;

    @NotBlank
    private String lastname;

//    Aksepterer norske tlf-nummer som begynner med 2-7 eller 9, evt. utelandske tlf
    @Pattern(regexp = "/^(?:[2-7,9]\\d{7}|(?:\\+|00)\\d{6,})$/")
    private String tel;

//     Aksepterer "normale" epost-adresser (https://www.regular-expressions.info/email.html)
    @Pattern(regexp = "/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i")
    private String email;

    /*@Override
    public String toString() {
        return "Ticket{" +
                "Film='" + film + '\'' +
                ", amount=" + amount +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", tel='" + tel + '\'' +
                ", email='" + email + '\'' +
                '}';
    }*/

   /* public Ticket(String film, Integer amount, String firstname, String lastname, String tel, String email) {
        this.film = film;
        this.amount = amount;
        this.firstname = firstname;
        this.lastname = lastname;
        this.tel = tel;
        this.email = email;
    }*/
}
