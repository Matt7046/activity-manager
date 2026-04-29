import { useLingui } from "@lingui/react";
import { Box } from '@mui/material';
import { DataGrid, GridCallbackDetails, GridPaginationModel, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
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

// Modifica la Toolbar per accettare la traduzione
const CustomToolbar = ({ pulsanti }: { pulsanti: Pulsante[] }) => {
  const { i18n } = useLingui();
  return (
    <GridToolbarContainer>
      {/* Traduzione del pulsante Export */}
      <GridToolbarExport printOptions={{ label: i18n._("esporta") }} csvOptions={{ label: i18n._("esporta") }} />

      <Box sx={{ flexGrow: 1 }} />

      <Button pulsanti={pulsanti}></Button>
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
      slots={{
        toolbar: CustomToolbar, // Aggiungi questa riga
      }}
      slotProps={{
        toolbar: {
          pulsanti: pulsanti || [], // Passa i pulsanti al CustomToolbar
        }
      }}
      // Traduzione globale dei testi della DataGrid
      localeText={{
        toolbarExport: i18n._("esporta"), // Testo principale del pulsante
        toolbarExportLabel: i18n._("esporta"),
        toolbarExportCSV: "CSV",
        toolbarExportPrint: i18n._("stampa"),
        noRowsLabel: i18n._("nessun_risultato") // Esempio extra
      }}
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id || `${row.dateSender}-${row.message}`}
      rowCount={rowCount}
      loading={loading}
      pageSizeOptions={[5, 10, 20]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      paginationMode="client" // Cambia in "server" se gestisci il recupero dati lato API
      getRowHeight={() => 'auto'}
      disableColumnMenu
      disableRowSelectionOnClick
      hideFooterSelectedRowCount
    />
  );
};

export default DataGridComponent;