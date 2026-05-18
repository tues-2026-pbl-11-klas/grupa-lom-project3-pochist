package com.chist.userservice.service;

import com.chist.userservice.exception.UserNotFoundException;
import com.chist.userservice.model.User;
import com.chist.userservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UUID testId;

    @BeforeEach
    void setUp() {
        testId = UUID.randomUUID();
        testUser = User.builder()
                .email("test@test.com")
                .username("testuser")
                .points(100)
                .streak(5)
                .build();
    }

    @Test
    void getUserById_success() {
        when(userRepository.findById(testId)).thenReturn(Optional.of(testUser));
        User result = userService.getUserById(testId);
        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
    }

    @Test
    void getUserById_notFound_throwsException() {
        when(userRepository.findById(testId)).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class, () -> userService.getUserById(testId));
    }

    @Test
    void addPoints_success() {
        when(userRepository.findById(testId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        userService.addPoints(testId, 50);

        assertEquals(150, testUser.getPoints());
        verify(userRepository).save(testUser);
    }

    @Test
    void incrementStreak_success() {
        when(userRepository.findById(testId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        userService.increaseStreak(testId);

        assertEquals(6, testUser.getStreak());
        verify(userRepository).save(testUser);
    }

    @Test
    void resetStreak_success() {
        when(userRepository.findById(testId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        userService.resetStreak(testId);

        assertEquals(0, testUser.getStreak());
        verify(userRepository).save(testUser);
    }

    @Test
    void getTopUsers_success() {
        User user2 = User.builder().points(200).build();
        when(userRepository.findAll()).thenReturn(List.of(testUser, user2));

        List<User> result = userService.getTopUsers(2);

        assertEquals(2, result.size());
        assertEquals(200, result.get(0).getPoints());
    }
}