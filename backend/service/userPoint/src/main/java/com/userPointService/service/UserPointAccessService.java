package com.userPointService.service;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.common.data.user.UserPoint;
import com.common.security.EmailNormalization;
import com.common.structure.exception.ForbiddenException;
import com.userPointService.repository.UserPointRepository;

@Service
public class UserPointAccessService {

    private final UserPointRepository userPointRepository;

    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;


    public UserPointAccessService(UserPointRepository userPointRepository) {
        this.userPointRepository = userPointRepository;
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
        UserPoint tutor = userPointRepository.findByOnFigli(emailResourceCrypt);
        if (tutor == null) {
            // Alcune chiamate GET arrivano in plain-text; fallback su valore non cifrato.
            tutor = userPointRepository.findByOnFigli(r);
        }
        if (tutor == null || tutor.getEmail() == null) {
            return false;
        }
        String emailTutor = safeDecrypt(tutor.getEmail());
        return p.equals(EmailNormalization.normalize(emailTutor));
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
            throw new ForbiddenException("Risorsa non autorizzata.");
        }
        if (!canAccess(principalEmail, resourceEmail)) {
            throw new ForbiddenException("Accesso negato per questa risorsa.");
        }
    }

    public void requireSelf(String principalEmail, String emailUserCurrent) {
        String p = EmailNormalization.normalize(principalEmail);
        String e = EmailNormalization.normalize(emailUserCurrent);
        if (e == null || e.isEmpty()) {
            throw new ForbiddenException("Identità richiesta mancante.");
        }
        if (!e.equals(p)) {
            throw new ForbiddenException("Operazione non consentita per altri utenti.");
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
