package com.chist.userservice.service;

import com.chist.userservice.exception.UserNotFoundException;
import com.chist.userservice.model.User;
import com.chist.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getUserById(UUID id){
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

    }

    public User getUserByEmail(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));
    }

    public void addPoints(UUID id, int points){
        User user = getUserById(id);
        user.setPoints(user.getPoints() + points);
        userRepository.save(user);
    }

    public void increaseStreak(UUID id){
        User user = getUserById(id);
        user.setStreak(user.getStreak() + 1);
        userRepository.save(user);
    }

    public void resetStreak(UUID id){
        User user = getUserById(id);
        user.setStreak(0);
        userRepository.save(user);
    }

    public List<User> getTopUsers(int limit){
        return userRepository.findAll()
                .stream()
                .sorted((a,b) -> Integer.compare(b.getPoints(),a.getPoints()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
}
