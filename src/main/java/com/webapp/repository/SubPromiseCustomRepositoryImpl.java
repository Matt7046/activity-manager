package com.webapp.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.webapp.data.SubPromise;
import com.webapp.dto.SubPromiseDTO;
import com.webapp.service.SubPromiseService;
public class SubPromiseCustomRepositoryImpl implements SubPromiseCustomRepository {


@Lazy
    @Autowired
    private SubPromiseService subPromiseRepository;
    public String saveSubPromise(SubPromiseDTO subPromiseDTO) {
        // Verifica se esiste già un documento con l'identificativo
        SubPromise existingPromise = null;
        if (subPromiseDTO.get_id() != null) {
            existingPromise = subPromiseRepository.findByIdentificativo(subPromiseDTO.get_id());
        }

        if (existingPromise != null) {
            // Se esiste, aggiorna i campi
            SubPromiseDTO newPromise = new SubPromiseDTO();
            newPromise.set_id(existingPromise.get_id());
            newPromise.setNome(subPromiseDTO.getNome());
            newPromise.setSubTesto(subPromiseDTO.getSubTesto());
            existingPromise = subPromiseRepository.save(newPromise);

            return existingPromise.get_id();// Restituisci l'ID aggiornato
        } else {
            SubPromise newPromiseR = new SubPromise();
             // Se non esiste, crea un nuovo documento
            SubPromiseDTO newPromise = new SubPromiseDTO();
            newPromise.setNome(subPromiseDTO.getNome());
            newPromise.setSubTesto(subPromiseDTO.getSubTesto());
            try {
                newPromiseR = subPromiseRepository.save(newPromise);
            } catch (Exception e) {
                // Log dell'errore per un'analisi successiva
                System.err.println("Errore durante il salvataggio del documento SubPromise: " + e.getMessage());
            }
            return newPromiseR.get_id(); // Restituisci l'ID del nuovo documento
        }
    }
}