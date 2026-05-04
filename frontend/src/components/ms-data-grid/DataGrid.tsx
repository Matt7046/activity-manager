"use client";

import { useLingui } from "@lingui/react";
import { Box } from '@mui/material';
import {
  DataGrid,
  GridCallbackDetails,
  GridPaginationModel,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarProps
} from "@mui/x-data-grid";
import React from 'react';
import Button, { Pulsante } from "../ms-button/Button";
import "./DataGrid.css";

interface DataGridComponentProps {
  rows: any[];
  columns: any[];
  rowCount?: number;
  loading: boolean;
  paginationModel: GridPaginationModel;
  setPaginationModel?: ((model: GridPaginationModel, details: GridCallbackDetails<any>) => void) | undefined;
  pulsanti?: Pulsante[];
}

// 1. Definiamo un'interfaccia che estende GridToolbarProps per includere i tuoi pulsanti
interface CustomToolbarProps extends GridToolbarProps {
  pulsanti?: Pulsante[];
}

// 2. Modifichiamo il componente per accettare le props estese
const CustomToolbar = (props: CustomToolbarProps) => {
  const { i18n } = useLingui();
  // Estraiamo 'pulsanti' e passiamo il resto (altre props della toolbar) al container
  const { pulsanti, ...other } = props;

  return (
    <GridToolbarContainer {...other}>
      <GridToolbarExport 
        printOptions={{ label: i18n._("esporta") }} 
        csvOptions={{ label: i18n._("esporta") }} 
      />
      <Box sx={{ flexGrow: 1 }} />
      {/* Passiamo l'array di pulsanti al tuo componente Button personalizzato */}
      <Button pulsanti={pulsanti || []}></Button>
    </GridToolbarContainer>
  );
};

const DataGridComponent: React.FC<DataGridComponentProps> = ({
  rows,
  columns,
  rowCount,
  loading,
  paginationModel,
  setPaginationModel,
  pulsanti
}) => {
  const { i18n } = useLingui();

  return (
    <DataGrid
      // 3. Ora CustomToolbar è compatibile con il tipo richiesto da slots.toolbar
      slots={{
        toolbar: CustomToolbar as React.JSXElementConstructor<GridToolbarProps>,
      }}
      slotProps={{
        toolbar: {
          pulsanti: pulsanti || [],
        }
      }}
      localeText={{
        toolbarExport: i18n._("esporta"),
        toolbarExportLabel: i18n._("esporta"),
        toolbarExportCSV: "CSV",
        toolbarExportPrint: i18n._("stampa"),
        noRowsLabel: i18n._("nessun_risultato")
      }}
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id || `${row.dateSender}-${row.message}`}
      loading={loading}
      pageSizeOptions={[5, 10, 20]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      paginationMode="client"
      getRowHeight={() => 'auto'}
      disableColumnMenu
      disableRowSelectionOnClick
      hideFooterSelectedRowCount
      // Ottimizzazione MUI v6 per celle con altezza dinamica
      sx={{
        '& .MuiDataGrid-cell': {
          py: 1,
        },
      }}
    />
  );
};

export default DataGridComponent;