package com.example.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.example.demo.model.User;
import com.example.demo.model.dto.UserRegistrationDto;


// public interface UserService extends UserDetailsService{
// 	User save(UserRegistrationDto registrationDto);
// }

public interface UserService {
    User save(UserRegistrationDto registrationDto);
}
