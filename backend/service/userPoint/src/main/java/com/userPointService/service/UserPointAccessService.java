package com.userPointService.service;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.common.security.EmailNormalization;
import com.common.structure.exception.ForbiddenException;
import com.common.structure.messages.ForbiddenMessages;
import com.common.data.user.UserPoint;
import com.userPointService.repository.UserPointRepository;

import java.util.List;

@Service
public class UserPointAccessService {

    private final UserPointRepository userPointRepository;
    private final ForbiddenMessages forbiddenMessages;

    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;

    public UserPointAccessService(UserPointRepository userPointRepository, ForbiddenMessages forbiddenMessages) {
        this.userPointRepository = userPointRepository;
        this.forbiddenMessages = forbiddenMessages;
    }

    public boolean canAccess(String principalEmail, String targetEmail) {
        String p = EmailNormalization.normalize(principalEmail);
        String r = EmailNormalization.normalize(safeDecrypt(targetEmail));
        if (p == null || r == null || r.isEmpty()) {
            return false;
        }
        if (p.equals(r)) {
            return true;
        }
        String emailResourceCrypt = encryptDecryptConverter.convert(r);
        List<UserPoint> tutors = userPointRepository.findAllParentsHavingChildInEmailFigli(emailResourceCrypt);
        if (tutors.isEmpty()) {
            // Alcune chiamate arrivano in plain-text; fallback su valore non cifrato.
            tutors = userPointRepository.findAllParentsHavingChildInEmailFigli(r);
        }
        for (UserPoint tutor : tutors) {
            if (tutor != null && tutor.getEmail() != null) {
                String emailTutor = safeDecrypt(tutor.getEmail());
                if (p.equals(EmailNormalization.normalize(emailTutor))) {
                    return true;
                }
            }
        }
        return false;
    }

    private String safeDecrypt(String value) {
        try {
            return encryptDecryptConverter.decrypt(value);
        } catch (Exception ignored) {
            return value;
        }
    }

    public void requireCanAccess(String principalEmail, String resourceEmail) {
        if (resourceEmail == null || resourceEmail.isBlank()) {
            throw new ForbiddenException(forbiddenMessages.resourceMissing());
        }
        if (!canAccess(principalEmail, resourceEmail)) {
            throw new ForbiddenException(forbiddenMessages.accessDeniedResource());
        }
    }

    public void requireSelf(String principalEmail, String emailUserCurrent) {
        String p = EmailNormalization.normalize(principalEmail);
        String e = EmailNormalization.normalize(emailUserCurrent);
        if (e == null || e.isEmpty()) {
            throw new ForbiddenException(forbiddenMessages.identityMissing());
        }
        if (!e.equals(p)) {
            throw new ForbiddenException(forbiddenMessages.operationNotSelf());
        }
    }

    public void requireFamilyPointsTransfer(String principalEmail, String emailUserCurrent, String targetEmail) {
        if (emailUserCurrent != null && !emailUserCurrent.isBlank()) {
            requireSelf(principalEmail, emailUserCurrent);
        }
        if (targetEmail != null && !targetEmail.isBlank()) {
            requireCanAccess(principalEmail, targetEmail);
        }
    }
}
