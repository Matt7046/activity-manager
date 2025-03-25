package com.activityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.common.configurations.EncryptDecryptConverter;
@Service
public class RegisterService {

    @Autowired
    EncryptDecryptConverter encryptDecryptConverter; 



}
