import { DataGrid, GridCallbackDetails, GridPaginationModel } from "@mui/x-data-grid";
import React from 'react';
import Button from "../ms-button/Button";
import "./DataGrid.css";

import { Box } from '@mui/material';
import { GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Pulsante } from "../ms-button/Button";

interface DataGridComponentProps {
  rows: any[];
  columns: any[];
  rowCount?: number;
  loading: boolean;
  paginationModel: GridPaginationModel;
  setPaginationModel?: ((model: GridPaginationModel, details: GridCallbackDetails<any>) => void) | undefined;
  pulsanti?: Pulsante[];
}

const CustomToolbar = ({ pulsanti }: { pulsanti: Pulsante[] }) => {    return (
      <GridToolbarContainer>
        {/* Elementi a sinistra (opzionali, es: Export) */}
        <GridToolbarExport />

        {/* Questo Box vuoto spinge tutto ciò che segue verso destra */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Pulsante posizionato a destra */}
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