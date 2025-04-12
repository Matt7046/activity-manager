package com.common.dto;

import java.util.List;

import com.common.authDTO.PointsUser;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class UserPointDTO implements InterfaceDTO {

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
	private String emailUserCurrent;

	public UserPointDTO(LogActivityDTO logActivityDTO)
	{
		setPoint(logActivityDTO.getPoints());
		setEmail(logActivityDTO.getEmail());
		setEmailFamily(logActivityDTO.getEmailFamily());
		setUsePoints(logActivityDTO.getUsePoints());
	}
}
