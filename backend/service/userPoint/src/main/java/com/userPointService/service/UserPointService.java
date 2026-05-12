package com.userPointService.service;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.user.UserPoint;
import com.common.structure.exception.ArithmeticCustomException;
import com.common.structure.exception.ForbiddenException;
import com.common.structure.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.userPointService.repository.UserPointRepository;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserPointService {
    @Autowired
    private UserPointRepository userPointRepository;
    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;

    @Value("${error.document.arithmetic}")
    private String arithmeticProperties;

    @Value("${error.document.notFound}")
    private String errorDocumentNotFound;

    public List<UserPoint> findAll() {
        return userPointRepository.findAll();
    }

    public UserPoint findByEmailAndType(String identificativo, Long type) {
        return userPointRepository.findByEmailAndType(identificativo, type);
    }

    public UserPoint getEmailChild(UserPoint userPoint) {
        UserPoint existingUserPoint = userPointRepository.findUserByEmail(userPoint.getEmailUserCurrent());

        if (existingUserPoint == null) {
            return new UserPoint();
        }
        return existingUserPoint;
    }

    public UserPoint getUserByEmail(UserPoint userPoint) {
        UserPoint existingUserPoint = userPointRepository.findUserByEmail(userPoint.getEmailUserCurrent());
        if (existingUserPoint == null) {
            UserPoint userPointChild = userPointRepository.findByOnFigli(userPoint.getEmailUserCurrent());
            existingUserPoint = userPointChild;
        }
        if (existingUserPoint == null) {
            return new UserPoint();
        }
        return existingUserPoint;

    }

    public UserPoint findByOnFigli(UserPoint userPoint) {
        return userPointRepository.findByOnFigli(userPoint.getEmail());
    }

    public UserPoint savePoint(UserPoint userPoint) {

        UserPoint existingUserPoint = userPointRepository.findUserByEmail(userPoint.getEmail());
        Integer delta = userPoint.getOperation() ? userPoint.getUsePoints() : -userPoint.getUsePoints();
        int updatedPoint = existingUserPoint.getPoints() + delta;
        if (updatedPoint < 0) {
            throw new ArithmeticCustomException(arithmeticProperties);
        }
        existingUserPoint.setPoints(updatedPoint);
        userPointRepository.save(existingUserPoint);
        return existingUserPoint;
    }

    public UserPoint rollbackSavePoint(UserPoint userPoint) {
        userPoint.setOperation(!userPoint.getOperation());
        return savePoint(userPoint);
    }

    public UserPoint saveUser(UserPoint userPoint, List<UserPoint> userChild) {
        UserPoint existsUser = userPointRepository.findUserByEmailAll(userPoint.getEmailUserCurrent());
        if (existsUser != null) {
            userPoint.set_id(existsUser.get_id());
        }
        List<String> childEmails = userChild.stream()
                .map(UserPoint::getEmail)
                .collect(Collectors.toList());

        // 3. UNA SOLA QUERY per trovare tutti i figli esistenti
        List<UserPoint> existingChildren = userPointRepository.findAllByEmailIn(childEmails);
        // 4. Trasformiamo la lista in una Map di OGGETTI completi (non solo ID)
        Map<String, UserPoint> existingUsersMap = existingChildren.stream()
                .collect(Collectors.toMap(UserPoint::getEmail, x -> x));

        // 5. Associamo i dati corretti
        List<UserPoint> updatedUserChild = userChild.stream().map(child -> {
            UserPoint dbUser = existingUsersMap.get(child.getEmail());
            // Se esiste a DB restituisco quello del DB, altrimenti quello nuovo
            return (dbUser != null) ? dbUser : child;
        }).collect(Collectors.toList());
        userPoint = userPointRepository.save(userPoint);
        userPointRepository.saveAll(updatedUserChild);
        return userPoint;
    }

    public UserPoint saveUserPassword(UserPoint userPoint) {
        UserPoint existsUser = userPointRepository.findUserByEmailAll(userPoint.getEmailUserCurrent());
        if (existsUser != null) {
            existsUser.setPassword(userPoint.getPassword());
        }
        userPoint = userPointRepository.save(existsUser);
        return userPoint;
    }

    public Integer getTypeUser(UserPoint point) {
        UserPoint existUserPointOnFigli = userPointRepository.findUserByEmail(point.getEmailUserCurrent());
        return existUserPointOnFigli != null ? existUserPointOnFigli.getType() : 2;
    }

    public UserPoint saveUserImage(UserPoint userPoint) {

        UserPoint existingUserPoint = userPointRepository.findUserByEmail(userPoint.getEmailChild());
        UserPoint updatedPoints = ovverideNameImage(userPoint, existingUserPoint);
        return userPointRepository.save(updatedPoints);
    }

    /** Lettura API: mappa id card (frontend) → path. */
    public Map<String, String> resolveNameImagesBySlot(UserPoint point) {
        return Map.copyOf(mutableImagesBySlot(point));
    }

    private static String sanitizeImageCardId(String raw) {
        if (raw == null || raw.isBlank()) {
            return "";
        }
        return raw.trim().replace("$", "_").replace(".", "_");
    }

    private static LinkedHashMap<String, String> mutableImagesBySlot(UserPoint point) {
        LinkedHashMap<String, String> m = new LinkedHashMap<>();
        if (point.getImagesBySlot() != null) {
            point.getImagesBySlot().forEach((k, v) -> {
                if (k != null && !k.isBlank() && v != null && !v.isBlank()) {
                    m.put(k, v);
                }
            });
        }
        return m;
    }

    private UserPoint ovverideNameImage(UserPoint userPointSave, UserPoint point) {
        if (!userPointSave.getEmail().equals(point.getEmail())) {
            return point;
        }
        String newPath = userPointSave.getNameImage();
        if (newPath == null || newPath.isBlank()) {
            return point;
        }

        String cardId = sanitizeImageCardId(userPointSave.getImageCardId());
        if (cardId.isEmpty()) {
            return point;
        }
        LinkedHashMap<String, String> map = mutableImagesBySlot(point);
        map.put(cardId, newPath);
        point.setImagesBySlot(map);
        point.setNameImages(new ArrayList<>(map.values()));
        return point;
    }

    public UserPoint login(UserPoint userPointLogin) {
        UserPoint existingUserPoint = userPointRepository.findByPointEmailAndPassword(userPointLogin.getEmail(),
                userPointLogin.getPassword());
        if (existingUserPoint == null) {
            return new UserPoint();
        }
        return existingUserPoint;
    }

    public UserPoint updateStatus(UserPoint userPointSave) {
        userPointRepository.updateStatus(userPointSave.getEmailUserCurrent(), userPointSave.getStatus());
        UserPoint existingUserPoint = userPointRepository.findUserByEmail(userPointSave.getEmailUserCurrent());
        return existingUserPoint;
    }


    public UserPoint updateChildByEmail(UserPoint parentKey, List<UserPoint> childOps) {
        return updateChildByEmail(parentKey, childOps, null);
    }

    /**
     * Aggiorna {@code emailFigli} del genitore. Per ogni aggiunta ({@code operation} true), crea il documento
     * figlio se non esiste (come in registrazione: 100 punti, type 0, password casuale).
     *
     * @param newChildrenOut se non null, vi si aggiungono i figli appena creati (per notifiche).
     */
    public UserPoint updateChildByEmail(UserPoint parentKey, List<UserPoint> childOps, List<UserPoint> newChildrenOut) {
        UserPoint existing = userPointRepository.findUserByEmail(parentKey.getEmailUserCurrent());
        if (existing == null) {
            throw new NotFoundException(errorDocumentNotFound + parentKey.getEmailUserCurrent());
        }
        List<String> emails = new ArrayList<>(Optional.ofNullable(existing.getEmailFigli()).orElseGet(ArrayList::new));
        for (UserPoint op : Optional.ofNullable(childOps).orElseGet(List::of)) {
            if (op == null || op.getEmail() == null || op.getEmail().isBlank()) {
                continue;
            }
            String enc = op.getEmail().trim();
            if (Boolean.TRUE.equals(op.getOperation())) {
                assertCandidateNotAlreadyParent(enc);
                ensureChildUserPointCreated(enc, newChildrenOut);
                if (!emails.contains(enc)) {
                    emails.add(enc);
                }
            } else {
                emails.remove(enc);
            }
        }
        existing.setEmailFigli(emails);
        return userPointRepository.save(existing);
    }

    /**
     * Un utente già genitore (tipo famiglia o con figli in {@code emailFigli}) non può essere aggiunto come figlio.
     */
    private void assertCandidateNotAlreadyParent(String emailEncrypted) {
        UserPoint existing = userPointRepository.findUserByEmailAll(emailEncrypted);
        if (existing == null) {
            return;
        }
        boolean hasFigli = existing.getEmailFigli() != null && !existing.getEmailFigli().isEmpty();
        boolean isFamilyAccount = Integer.valueOf(1).equals(existing.getType());
        if (hasFigli || isFamilyAccount) {
            throw new ForbiddenException(
                    "Questo utente è già genitore (account famiglia o ha figli registrati) e non può essere aggiunto come figlio.");
        }
    }

    private void ensureChildUserPointCreated(String emailEncrypted, List<UserPoint> newChildrenOut) {
        UserPoint already = userPointRepository.findUserByEmailAll(emailEncrypted);
        if (already != null) {
            return;
        }
        UserPoint child = new UserPoint();
        child.setEmail(emailEncrypted);
        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        child.setPassword(encryptDecryptConverter.convert(tempPassword));
        child.setPoints(100);
        child.setType(0);
        child.setStatus(1);
        child.setPointFigli(new ArrayList<>());
        child.setEmailFigli(new ArrayList<>());
        UserPoint saved = userPointRepository.save(child);
        if (newChildrenOut != null) {
            newChildrenOut.add(saved);
        }
    }
}
