"use client";

import { useLingui } from "@lingui/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import React, { useMemo } from "react";
import { Button as UiButton } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Button, { Pulsante } from "../ms-button/Button";
import "./DataGrid.css";

export const resolveRowId = (row: object, index: number): string => {
  const record = row as Record<string, unknown>;
  const id = record._id ?? record.id;
  if (id != null && id !== "") {
    return String(id);
  }
  const dateSender = record.dateSender != null ? String(record.dateSender) : "";
  const message = record.message != null ? String(record.message) : "";
  if (dateSender || message) {
    return `${dateSender}-${message}-${index}`;
  }
  return String(index);
};

export interface PaginationModel {
  page: number;
  pageSize: number;
}

/** Allinea il blocco pulsanti toolbar (es. Nuovo) alla colonna azioni con stesso rapporto flex delle colonne. */
export interface ToolbarColumnSplit {
  mainFlex: number;
  actionFlex: number;
  mainMinWidth?: number;
  actionMinWidth?: number;
}

interface DataGridComponentProps<TData extends object> {
  rows: TData[];
  columns: ColumnDef<TData, unknown>[];
  loading?: boolean;
  paginationModel: PaginationModel;
  setPaginationModel?: (model: PaginationModel) => void;
  pulsanti?: Pulsante[];
  toolbarColumnSplit?: ToolbarColumnSplit;
  exportFileName?: string;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

const escapeCsvValue = (value: unknown): string => {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const exportRowsToCsv = <TData extends object>(
  rows: TData[],
  columns: ColumnDef<TData, unknown>[],
  fileName: string
) => {
  const exportColumns = columns.filter((column) => {
    const id = column.id ?? ("accessorKey" in column ? String(column.accessorKey) : "");
    return id && id !== "actions";
  });

  const headerLine = exportColumns
    .map((column) => {
      if (typeof column.header === "string") {
        return escapeCsvValue(column.header);
      }
      return escapeCsvValue(column.id ?? "");
    })
    .join(",");

  const dataLines = rows.map((row) =>
    exportColumns
      .map((column) => {
        const key =
          column.id ??
          ("accessorKey" in column && column.accessorKey != null ? String(column.accessorKey) : "");
        return escapeCsvValue(key ? (row as Record<string, unknown>)[key] : "");
      })
      .join(",")
  );

  const csv = [headerLine, ...dataLines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

function DataGridComponent<TData extends object>({
  rows,
  columns,
  loading = false,
  paginationModel,
  setPaginationModel,
  pulsanti,
  toolbarColumnSplit,
  exportFileName = "export",
}: DataGridComponentProps<TData>) {
  const { i18n } = useLingui();

  const tableRows = useMemo(
    () =>
      rows.map((row, index) => ({
        ...row,
        id: resolveRowId(row, index),
      })) as Array<TData & { id: string }>,
    [rows]
  );

  const table = useReactTable({
    data: tableRows,
    columns,
    state: {
      pagination: {
        pageIndex: paginationModel.page,
        pageSize: paginationModel.pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (!setPaginationModel) {
        return;
      }
      const next =
        typeof updater === "function"
          ? updater({
              pageIndex: paginationModel.page,
              pageSize: paginationModel.pageSize,
            })
          : updater;
      setPaginationModel({ page: next.pageIndex, pageSize: next.pageSize });
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => String((row as TData & { id: string }).id),
    manualPagination: false,
  });

  const pageCount = table.getPageCount();
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  const columnSplit =
    toolbarColumnSplit && columns.length === 2
      ? {
          mainWidth: `${(toolbarColumnSplit.mainFlex / (toolbarColumnSplit.mainFlex + toolbarColumnSplit.actionFlex)) * 100}%`,
          actionWidth: `${(toolbarColumnSplit.actionFlex / (toolbarColumnSplit.mainFlex + toolbarColumnSplit.actionFlex)) * 100}%`,
          mainMinWidth: toolbarColumnSplit.mainMinWidth ?? 0,
          actionMinWidth: toolbarColumnSplit.actionMinWidth ?? 0,
        }
      : null;

  const getColumnStyle = (columnIndex: number): React.CSSProperties | undefined => {
    if (!columnSplit) {
      return undefined;
    }
    if (columnIndex === 0) {
      return { width: columnSplit.mainWidth, minWidth: columnSplit.mainMinWidth };
    }
    if (columnIndex === 1) {
      return { width: columnSplit.actionWidth, minWidth: columnSplit.actionMinWidth };
    }
    return undefined;
  };

  const toolbar = (
    <div className="datagrid-toolbar flex w-full flex-nowrap items-center gap-2 border-b border-[var(--color-border)] px-2 py-2">
      {toolbarColumnSplit ? (
        <>
          <div
            className="flex min-w-[150px] flex-1 items-center gap-1 overflow-hidden"
            style={{
              flexGrow: toolbarColumnSplit.mainFlex,
              flexBasis: 0,
              minWidth: toolbarColumnSplit.mainMinWidth ?? 0,
            }}
          >
            <UiButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => exportRowsToCsv(tableRows, columns, exportFileName)}
            >
              <Download className="size-4" />
              {i18n._("esporta")}
            </UiButton>
          </div>
          <div
            className="flex shrink-0 items-center justify-end px-1"
            style={{
              flexGrow: toolbarColumnSplit.actionFlex,
              flexBasis: 0,
              minWidth: toolbarColumnSplit.actionMinWidth ?? 0,
            }}
          >
            <Button pulsanti={pulsanti || []} />
          </div>
        </>
      ) : (
        <>
          <UiButton
            type="button"
            variant="outline"
            size="sm"
            onClick={() => exportRowsToCsv(tableRows, columns, exportFileName)}
          >
            <Download className="size-4" />
            {i18n._("esporta")}
          </UiButton>
          <div className="flex-1" />
          <Button pulsanti={pulsanti || []} />
        </>
      )}
    </div>
  );

  return (
    <div className="datagrid-root w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
      {toolbar}
      <div className="datagrid-table-wrap relative min-h-[300px] flex-1">
        {loading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--color-surface)]/70">
            <Loader2 className="size-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : null}
        <Table className={cn("datagrid-table", columnSplit && "datagrid-table--split")}>
          {columnSplit ? (
            <colgroup>
              <col style={{ width: columnSplit.mainWidth, minWidth: columnSplit.mainMinWidth }} />
              <col style={{ width: columnSplit.actionWidth, minWidth: columnSplit.actionMinWidth }} />
            </colgroup>
          ) : null}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, columnIndex) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      header.column.id === "actions" && "text-right"
                    )}
                    style={getColumnStyle(columnIndex)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell, columnIndex) => (
                    <TableCell
                      key={cell.id}
                      className={cn(cell.column.id === "actions" && "text-right")}
                      style={getColumnStyle(columnIndex)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {i18n._("nessun_risultato")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="datagrid-footer flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-muted)]">
        <div className="flex items-center gap-2">
          <span>{i18n._("righe_per_pagina") || "Righe"}</span>
          <Select
            value={String(paginationModel.pageSize)}
            onValueChange={(value: string | null) => {
              if (value) {
                setPaginationModel?.({ page: 0, pageSize: Number(value) });
              }
            }}
          >
            <SelectTrigger size="sm" className="h-8 w-[72px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span>
            {paginationModel.page + 1} / {Math.max(pageCount, 1)}
          </span>
          <UiButton
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!canPreviousPage}
            onClick={() => table.previousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </UiButton>
          <UiButton
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!canNextPage}
            onClick={() => table.nextPage()}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </UiButton>
        </div>
      </div>
    </div>
  );
}

export default DataGridComponent;
