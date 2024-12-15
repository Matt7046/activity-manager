package com.webapp.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.webapp.data.SubPromise;
import com.webapp.dto.SubPromiseDTO;

public class SubPromiseCustomRepositoryImpl implements SubPromiseCustomRepository {

    @Lazy
    @Autowired
    private SubPromiseRepository subPromiseRepository;

    public String saveSubPromise(SubPromiseDTO subPromiseDTO) {
        // Verifica se esiste già un documento con l'identificativo
        SubPromise existingPromise = null;
        if (subPromiseDTO.get_id() != null) {
            existingPromise = subPromiseRepository.findByIdentificativo(subPromiseDTO.get_id());
        }

        if (existingPromise != null) {
            // Se esiste, aggiorna i campi
            SubPromise newPromise = new SubPromise();
            newPromise.set_id(existingPromise.get_id());
            newPromise.setNome(subPromiseDTO.getNome());
            newPromise.setSubTesto(subPromiseDTO.getSubTesto());
            existingPromise = subPromiseRepository.save(newPromise);

            return existingPromise.get_id();// Restituisci l'ID aggiornato
        } else {
            // Se non esiste, crea un nuovo documento
            SubPromise newPromise = new SubPromise();
            newPromise.setNome(subPromiseDTO.getNome());
            newPromise.setSubTesto(subPromiseDTO.getSubTesto());
            newPromise = subPromiseRepository.save(newPromise);
            return newPromise.get_id(); // Restituisci l'ID del nuovo documento
        }
    }
}