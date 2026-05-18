package com.chist.userservice.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Entity
@DiscriminatorValue("Verified_User")
@Getter @Setter
@NoArgsConstructor
@SuperBuilder
public class VerifiedUser extends User {

    @Column(name = "verified_since")
    private Date verifiedSince;

    @Column(name = "bonus_multiplier")
    private float bonusMultiplier = 2.5f;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("VERIFIED_USER"));
    }

    public float getBonus() {
        return getPoints() * bonusMultiplier;
    }
}