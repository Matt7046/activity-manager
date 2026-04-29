import { i18n } from "@lingui/core";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Collapse, Divider, Typography } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { observer } from 'mobx-react';
import { useMemo, useState } from 'react';
import Button, { Pulsante } from '../ms-button/Button';
import DataGrid from '../ms-data-grid/DataGrid';
import './Schedule.css';


export interface MsSchedule {
  justifyContent?: string;
  onClose?: () => void;
  handleClose: () => void;
  schedule: { _id: string; nome: string; subtesto: string }[];
  isVertical: boolean;
  pulsanti: Pulsante[];
}

const Schedule = observer((props: { schedule: MsSchedule }) => {
  const [expandedRowId, setExpandedRowId] = useState<number | string | null>(null);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  // Estraiamo il pulsante "NEW" per passarlo alla toolbar della DataGrid
  const pulsantiToolbar = useMemo(() =>
    props.schedule.pulsanti.filter(p => p.nome.toUpperCase() === 'NEW'),
    [props.schedule.pulsanti]
  );

const columns: GridColDef[] = [
    {
      field: 'nome',
      headerName: i18n._('dettagli'),
      flex: 11, // Occupa 11 parti su 12
      minWidth: 150, 
      renderCell: (params: GridRenderCellParams) => {
        const isExpanded = expandedRowId === params.id;
        const row = params.row;

        return (
          <Box className="cell-container">
            <Box
              className="clickable-row-header"
              onClick={() => setExpandedRowId(isExpanded ? null : params.id)}
            >
              <InfoOutlinedIcon
                className="row-icon-info"
                style={{ color: isExpanded ? '#1976d2' : '#b2bec3' }}
              />
              <Box className="title-text-container">
                <Typography className="row-title">
                  {row.nome}
                </Typography>
              </Box>
              <KeyboardArrowDownIcon
                className={`row-icon-arrow ${isExpanded ? 'expanded' : ''}`}
              />
            </Box>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box className="expanded-content">
                <Divider className="subtesto-divider" />
                <Typography variant="body2" color="text.secondary">
                  {row.subTesto || i18n._("no_descrizione") }
                </Typography>
              </Box>
            </Collapse>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Azioni',
      flex: 1, // Occupa 1 parte su 12
      minWidth: 100,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        const item = params.row;
        const pulsantiAzione = props.schedule.pulsanti
          .filter(p => p.nome.toUpperCase() !== 'NEW' && p.nome.toUpperCase() !== 'RED')
          .map(p => ({
            ...p,
            funzione: () => p.funzione(item._id)
          }));

        return (
          <Box className="actions-container">
            <Button pulsanti={pulsantiAzione} />
          </Box>
        );
      },
    },
  ];









  // Trasformiamo i dati dello schedule in rows
  const rows = useMemo(() =>
    props.schedule.schedule.map(item => ({
      id: item._id, // DataGrid richiede un id univoco
      ...item
    })),
    [props.schedule.schedule]
  );

  return (
    <Box className="schedule-container">
      <DataGrid
        rows={rows}
        columns={columns}
        loading={false}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        pulsanti={pulsantiToolbar} // Il pulsante NEW finirà nella Toolbar a destra
        rowCount={rows.length}
      />
    </Box>
  );
});

export default Schedule;