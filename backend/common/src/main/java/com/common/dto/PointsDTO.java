package com.common.dto;

import java.util.List;

import com.common.transversal.PointsUser;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class PointsDTO implements InterfaceDTO {

	private String _id; // Identificatore unico
	private String email;
	private String emailFamily;
	private List<PointsUser>  points;
	private Long point;
	private Long type;
	private String numeroPunti;
	private String attivita;
	private Long usePoints;
	private List<String> emailFigli;
	private Boolean operation;

	public PointsDTO(LogActivityDTO logActivityDTO)
	{
		setPoint(logActivityDTO.getPoints());
		setEmail(logActivityDTO.getEmail());
		setEmailFamily(logActivityDTO.getEmailFamily());
		setUsePoints(logActivityDTO.getUsePoints());
	}

	public void generaAttivita(String[] attivitaSvolte) {
		setAttivita(attivitaSvolte.toString()
				.replace("[", "[\"")
				.replace("]", "\"]")
				.replace(", ", "\", \""));
	}

}
