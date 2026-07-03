"use client";

import { useLingui } from "@lingui/react";
import React from "react";
import {
  DataGrid,
  GridCallbackDetails,
  GridPaginationModel,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarProps,
} from "@mui/x-data-grid";
import Button, { Pulsante } from "../ms-button/Button";

/** Allinea il blocco pulsanti toolbar (es. Nuovo) alla colonna azioni con stesso rapporto flex delle colonne. */
export interface ToolbarColumnSplit {
  mainFlex: number;
  actionFlex: number;
  mainMinWidth?: number;
  actionMinWidth?: number;
}

declare module "@mui/x-data-grid" {
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
  setPaginationModel?:
    | ((model: GridPaginationModel, details: GridCallbackDetails<any>) => void)
    | undefined;
  pulsanti?: Pulsante[];
  toolbarColumnSplit?: ToolbarColumnSplit;
}

interface CustomToolbarProps extends GridToolbarProps {
  pulsanti?: Pulsante[];
  toolbarColumnSplit?: ToolbarColumnSplit;
}

const CustomToolbar = (props: CustomToolbarProps) => {
  const { pulsanti, toolbarColumnSplit, sx: toolbarSx, ...toolbarRest } = props;
  void toolbarSx;

  if (toolbarColumnSplit) {
    const { mainFlex, actionFlex, mainMinWidth = 0, actionMinWidth = 0 } = toolbarColumnSplit;
    return (
      <GridToolbarContainer {...toolbarRest} className="flex w-full flex-nowrap items-center">
        <div
          className="flex min-w-[150px] flex-1 items-center gap-1 overflow-hidden"
          style={{ flexGrow: mainFlex, flexBasis: 0, minWidth: mainMinWidth }}
        >
          <GridToolbarExport />
        </div>
        <div
          className="flex shrink-0 items-center justify-end px-1"
          style={{ flexGrow: actionFlex, flexBasis: 0, minWidth: actionMinWidth }}
        >
          <Button pulsanti={pulsanti || []} />
        </div>
      </GridToolbarContainer>
    );
  }

  return (
    <GridToolbarContainer {...toolbarRest} className="flex w-full items-center">
      <GridToolbarExport />
      <div className="flex-1" />
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
  void rowCount;

  return (
    <div className="datagrid-root w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] [&_.MuiDataGrid-columnHeaders]:border-b [&_.MuiDataGrid-columnHeaders]:border-[var(--color-border)] [&_.MuiDataGrid-columnHeaders]:bg-[var(--color-surface-soft)] [&_.MuiDataGrid-columnHeaders]:font-bold [&_.MuiDataGrid-cell]:border-b-0 [&_.MuiDataGrid-row:nth-child(even)]:bg-[var(--color-surface-soft)] [&_.MuiDataGrid-row:nth-child(odd)]:bg-[var(--color-surface)] [&_.MuiDataGrid-row:hover]:bg-[var(--color-info-soft)]">
      <DataGrid
        slots={{
          toolbar: CustomToolbar as React.JSXElementConstructor<GridToolbarProps>,
        }}
        slotProps={{
          toolbar: {
            pulsanti: pulsanti || [],
            ...(toolbarColumnSplit ? { toolbarColumnSplit } : {}),
          },
        }}
        localeText={{
          toolbarExport: i18n._("esporta"),
          toolbarExportLabel: i18n._("esporta"),
          toolbarExportCSV: "CSV",
          toolbarExportPrint: i18n._("stampa"),
          noRowsLabel: i18n._("nessun_risultato"),
        }}
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id || `${row.dateSender}-${row.message}`}
        loading={loading}
        pageSizeOptions={[5, 10, 20]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        paginationMode="client"
        getRowHeight={() => "auto"}
        disableColumnMenu
        disableRowSelectionOnClick
        hideFooterSelectedRowCount
      />
    </div>
  );
};

export default DataGridComponent;
