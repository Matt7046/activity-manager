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

/** Allinea il blocco pulsanti toolbar (es. Nuovo) alla colonna azioni con stesso rapporto flex delle colonne. */
export interface ToolbarColumnSplit {
  mainFlex: number;
  actionFlex: number;
  mainMinWidth?: number;
  actionMinWidth?: number;
}

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    pulsanti: Pulsante[];
    toolbarColumnSplit?: ToolbarColumnSplit;
  }
}
interface DataGridComponentProps {
  rows: any[];
  columns: any[];
  rowCount?: number;
  loading: boolean;
  paginationModel: GridPaginationModel;
  setPaginationModel?: ((model: GridPaginationModel, details: GridCallbackDetails<any>) => void) | undefined;
  pulsanti?: Pulsante[];
  toolbarColumnSplit?: ToolbarColumnSplit;
}

interface CustomToolbarProps extends GridToolbarProps {
  pulsanti?: Pulsante[];
  toolbarColumnSplit?: ToolbarColumnSplit;
}

const CustomToolbar = (props: CustomToolbarProps) => {
  const { pulsanti, toolbarColumnSplit, sx: toolbarSx, ...toolbarRest } = props;

  if (toolbarColumnSplit) {
    const { mainFlex, actionFlex, mainMinWidth = 0, actionMinWidth = 0 } = toolbarColumnSplit;
    return (
      <GridToolbarContainer {...toolbarRest} className="datagrid-toolbar datagrid-toolbar-split">
        <Box className="datagrid-toolbar-main" data-main-flex={mainFlex} data-main-min-width={mainMinWidth}>
          <GridToolbarExport />
        </Box>
        <Box className="datagrid-toolbar-actions" data-action-flex={actionFlex} data-action-min-width={actionMinWidth}>
          <Button pulsanti={pulsanti || []} />
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <GridToolbarContainer {...toolbarRest} className="datagrid-toolbar">
      <GridToolbarExport />
      <Box className="datagrid-toolbar-spacer" />
      <Button pulsanti={pulsanti || []} />
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
  pulsanti,
  toolbarColumnSplit,
}) => {
  const { i18n } = useLingui();

  return (
    <DataGrid
      slots={{
        toolbar: CustomToolbar as React.JSXElementConstructor<GridToolbarProps>,
      }}
      slotProps={{
        toolbar: {
          pulsanti: pulsanti || [],
          ...(toolbarColumnSplit ? { toolbarColumnSplit } : {}),
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
    />
  );
};

export default DataGridComponent;