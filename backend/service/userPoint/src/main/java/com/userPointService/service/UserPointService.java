package com.userPointService.service;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.user.FiglioLink;
import com.common.data.user.UserPoint;
import com.common.user.UserPointImageSlots;
import com.common.structure.exception.ArithmeticCustomException;
import com.common.structure.exception.ForbiddenException;
import com.common.structure.exception.NotFoundException;
import com.common.structure.messages.ArithmeticMessages;
import com.common.structure.messages.ForbiddenMessages;
import com.common.structure.messages.NotFoundMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.userPointService.repository.UserPointRepository;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserPointService {
    @Autowired
    private UserPointRepository userPointRepository;
    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;
    @Autowired
    private ForbiddenMessages forbiddenMessages;
    @Autowired
    private ArithmeticMessages arithmeticMessages;
    @Autowired
    private NotFoundMessages notFoundMessages;
    @Autowired
    private UserPointImageSlots userPointImageSlots;

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

    public UserPoint findSelfByEmailUserCurrent(UserPoint sub) {
        return userPointRepository.findUserByEmail(sub.getEmailUserCurrent());
    }

    private Map<String, Boolean> figlioLinksByChildEnc(UserPoint parent) {
        Map<String, Boolean> m = new LinkedHashMap<>();
        for (FiglioLink fl : Optional.ofNullable(parent.getFigliLinks()).orElse(List.of())) {
            if (fl != null && fl.getEmail() != null) {
                m.put(fl.getEmail(), fl.getCheck());
            }
        }
        return m;
    }

    /**
     * Confermato solo se esiste {@link FiglioLink} con {@code check == true} per questa email figlio cifrata.
     */
    private boolean isChildLinkConfirmedForParent(UserPoint parent, String childEncEmail) {
        return Boolean.TRUE.equals(figlioLinksByChildEnc(parent).get(childEncEmail));
    }

    /**
     * Email figli in chiaro; con {@code onlyChecked} solo voci con {@link FiglioLink#getCheck()} {@code true} per quel genitore.
     */
    public List<String> getChildEmailsPlainForParentDisplay(UserPoint parent, Boolean onlyChecked) {
        boolean filter = onlyChecked == null || onlyChecked;
        List<String> allEnc = Optional.ofNullable(parent.getEmailFigli()).orElse(List.of());
        if (!filter) {
            return allEnc.stream().map(encryptDecryptConverter::decrypt).collect(Collectors.toList());
        }
        return allEnc.stream()
                .filter(enc -> isChildLinkConfirmedForParent(parent, enc))
                .map(encryptDecryptConverter::decrypt)
                .collect(Collectors.toList());
    }

    public List<String> findPendingParentEmailsPlain(String childEncEmail) {
        List<UserPoint> parents = userPointRepository.findAllParentsHavingChildInEmailFigli(childEncEmail);
        List<String> out = new ArrayList<>();
        for (UserPoint p : parents) {
            if (!isChildLinkConfirmedForParent(p, childEncEmail)) {
                out.add(encryptDecryptConverter.decrypt(p.getEmail()));
            }
        }
        return out;
    }

    /**
     * Per ogni genitore con legame ancora in attesa: se è in {@code parentPlainEmails} si conferma il link,
     * altrimenti il figlio viene rimosso da {@code emailFigli} e da {@code figliLinks}.
     * Lista vuota o null = nessun genitore selezionato → tutti i pending vengono rimossi.
     */
    public void confirmChildParentLinks(String childEncEmail, List<String> parentPlainEmails) {
        Set<String> selectedParentsEnc = new LinkedHashSet<>();
        if (parentPlainEmails != null) {
            parentPlainEmails.stream()
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(encryptDecryptConverter::convert)
                    .forEach(selectedParentsEnc::add);
        }

        List<UserPoint> candidates = userPointRepository.findAllParentsHavingChildInEmailFigli(childEncEmail);
        for (UserPoint parent : candidates) {
            List<String> figli = parent.getEmailFigli();
            if (figli == null || !figli.contains(childEncEmail)) {
                continue;
            }
            if (isChildLinkConfirmedForParent(parent, childEncEmail)) {
                continue;
            }
            if (selectedParentsEnc.contains(parent.getEmail())) {
                approveChildLinkForParent(parent, childEncEmail);
            } else {
                removeChildFromParent(parent, childEncEmail);
            }
        }
    }

    private void approveChildLinkForParent(UserPoint parent, String childEncEmail) {
        List<FiglioLink> links = new ArrayList<>(Optional.ofNullable(parent.getFigliLinks()).orElseGet(ArrayList::new));
        boolean updated = false;
        for (FiglioLink fl : links) {
            if (childEncEmail.equals(fl.getEmail())) {
                fl.setCheck(Boolean.TRUE);
                updated = true;
                break;
            }
        }
        if (!updated) {
            links.add(new FiglioLink(childEncEmail, Boolean.TRUE));
        }
        parent.setFigliLinks(links);
        userPointRepository.save(parent);
    }

    private void removeChildFromParent(UserPoint parent, String childEncEmail) {
        List<String> emails = new ArrayList<>(Optional.ofNullable(parent.getEmailFigli()).orElse(List.of()));
        if (!emails.remove(childEncEmail)) {
            return;
        }
        parent.setEmailFigli(emails);
        List<FiglioLink> links = Optional.ofNullable(parent.getFigliLinks()).orElseGet(ArrayList::new);
        List<FiglioLink> next = links.stream()
                .filter(fl -> fl == null || !childEncEmail.equals(fl.getEmail()))
                .collect(Collectors.toList());
        parent.setFigliLinks(next);
        userPointRepository.save(parent);
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
            throw new ArithmeticCustomException(arithmeticMessages.negativePoints());
        }
        existingUserPoint.setPoints(updatedPoint);
        userPointRepository.save(existingUserPoint);
        return existingUserPoint;
    }

    public UserPoint rollbackSavePoint(UserPoint userPoint) {
        userPoint.setOperation(!userPoint.getOperation());
        return savePoint(userPoint);
    }

    private void applyFigliLinksForNewParent(UserPoint parent, List<String> childEnc) {
        List<FiglioLink> links = new ArrayList<>();
        for (String enc : childEnc) {
            links.add(new FiglioLink(enc, Boolean.FALSE));
        }
        parent.setFigliLinks(links);
    }

    private void mergeFigliLinksAfterMutation(UserPoint existing, List<String> newEmailList, Set<String> newlyAddedEnc) {
        Map<String, Boolean> old = figlioLinksByChildEnc(existing);
        List<FiglioLink> next = new ArrayList<>();
        Set<String> added = newlyAddedEnc == null ? Set.of() : newlyAddedEnc;
        for (String enc : newEmailList) {
            boolean isNew = added.contains(enc);
            boolean check = isNew ? false : Boolean.TRUE.equals(old.get(enc));
            next.add(new FiglioLink(enc, check));
        }
        existing.setFigliLinks(next);
    }

    public UserPoint saveUser(UserPoint userPoint, List<UserPoint> userChild) {
        UserPoint existsUser = userPointRepository.findUserByEmailAll(userPoint.getEmailUserCurrent());
        if (existsUser != null) {
            userPoint.set_id(existsUser.get_id());
        }
        List<String> childEmails = userChild.stream()
                .map(UserPoint::getEmail)
                .collect(Collectors.toList());

        List<UserPoint> existingChildren = userPointRepository.findAllByEmailIn(childEmails);
        Map<String, UserPoint> existingUsersMap = existingChildren.stream()
                .collect(Collectors.toMap(UserPoint::getEmail, x -> x));

        List<UserPoint> updatedUserChild = userChild.stream().map(child -> {
            UserPoint dbUser = existingUsersMap.get(child.getEmail());
            return (dbUser != null) ? dbUser : child;
        }).collect(Collectors.toList());

        userPoint.setEmailFigli(new ArrayList<>(childEmails));
        applyFigliLinksForNewParent(userPoint, childEmails);
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
        String childEmail = userPoint.getEmailChild() != null && !userPoint.getEmailChild().isBlank()
                ? userPoint.getEmailChild()
                : userPoint.getEmail();
        UserPoint existingUserPoint = userPointRepository.findUserByEmail(childEmail);
        if (existingUserPoint == null) {
            return userPoint;
        }
        UserPoint updatedPoints = ovverideNameImage(userPoint, existingUserPoint);
        return userPointRepository.save(updatedPoints);
    }

    public Map<String, String> resolveNameImagesBySlot(UserPoint point) {
        LinkedHashMap<String, String> normalized = new LinkedHashMap<>();
        userPointImageSlots.trimToAllowedSlots(mutableImagesBySlot(point))
                .forEach((slot, path) -> normalized.put(slot, userPointImageSlots.normalizeStoragePath(path)));
        return Map.copyOf(normalized);
    }

    private LinkedHashMap<String, String> mutableImagesBySlot(UserPoint point) {
        LinkedHashMap<String, String> m = new LinkedHashMap<>();
        if (point.getImagesBySlot() != null) {
            point.getImagesBySlot().forEach((k, v) -> {
                if (k != null && !k.isBlank() && v != null && !v.isBlank()) {
                    m.put(userPointImageSlots.sanitizeSlotId(k), v);
                }
            });
        }
        return m;
    }

    private UserPoint ovverideNameImage(UserPoint userPointSave, UserPoint point) {
        String newPath = userPointSave.getNameImage();
        if (newPath == null || newPath.isBlank()) {
            return point;
        }

        String cardId = userPointImageSlots.sanitizeSlotId(userPointSave.getImageCardId());
        if (!userPointImageSlots.isAllowedSlot(cardId)) {
            return point;
        }
        LinkedHashMap<String, String> map = mutableImagesBySlot(point);
        map.put(cardId, userPointImageSlots.normalizeStoragePath(newPath));
        point.setImagesBySlot(userPointImageSlots.trimToAllowedSlots(map));
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
        return updateChildByEmail(parentKey, childOps, null, null);
    }

    public UserPoint updateChildByEmail(UserPoint parentKey, List<UserPoint> childOps, List<UserPoint> newChildrenOut) {
        return updateChildByEmail(parentKey, childOps, newChildrenOut, null);
    }

    public UserPoint updateChildByEmail(UserPoint parentKey, List<UserPoint> childOps, List<UserPoint> newChildrenOut,
            Set<String> newlyAddedEncOut) {
        UserPoint existing = userPointRepository.findUserByEmail(parentKey.getEmailUserCurrent());
        if (existing == null) {
            throw new NotFoundException(notFoundMessages.parentUpdate());
        }
        List<String> emails = new ArrayList<>(Optional.ofNullable(existing.getEmailFigli()).orElseGet(ArrayList::new));
        Set<String> newlyAdded = new LinkedHashSet<>();
        for (UserPoint op : Optional.ofNullable(childOps).orElseGet(List::of)) {
            if (op != null && op.getEmail() != null && !op.getEmail().isBlank()) {
                String enc = op.getEmail().trim();
                if (Boolean.TRUE.equals(op.getOperation())) {
                    assertCandidateNotAlreadyParent(enc);
                    ensureChildUserPointCreated(enc, newChildrenOut);
                    if (!emails.contains(enc)) {
                        emails.add(enc);
                        newlyAdded.add(enc);
                    }
                } else {
                    emails.remove(enc);
                }
            }
        }
        existing.setEmailFigli(emails);
        mergeFigliLinksAfterMutation(existing, emails, newlyAdded);
        if (newlyAddedEncOut != null) {
            newlyAddedEncOut.addAll(newlyAdded);
        }
        return userPointRepository.save(existing);
    }

    private void assertCandidateNotAlreadyParent(String emailEncrypted) {
        UserPoint existing = userPointRepository.findUserByEmailAll(emailEncrypted);
        if (existing == null) {
            return;
        }
        boolean hasFigli = existing.getEmailFigli() != null && !existing.getEmailFigli().isEmpty();
        boolean isFamilyAccount = Integer.valueOf(1).equals(existing.getType());
        if (hasFigli || isFamilyAccount) {
            throw new ForbiddenException(forbiddenMessages.cannotAddChildIsParent());
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
