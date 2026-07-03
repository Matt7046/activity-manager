"use client";
import { i18n } from "@lingui/core";
import { ChevronDown, Info } from "lucide-react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { observer } from "mobx-react";
import { useMemo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Button, { Pulsante } from "../ms-button/Button";
import DataGrid from "../ms-data-grid/DataGrid";

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

  const pulsantiToolbar = useMemo(
    () => props.schedule.pulsanti.filter((p) => p.nome.toUpperCase() === "NEW"),
    [props.schedule.pulsanti]
  );

  const columns: GridColDef[] = [
    {
      field: "nome",
      headerName: i18n._("dettagli"),
      flex: 11,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => {
        const isExpanded = expandedRowId === params.id;
        const row = params.row;

        return (
          <Collapsible
            open={isExpanded}
            onOpenChange={(open) => setExpandedRowId(open ? params.id : null)}
            className="w-full"
          >
            <div className="w-full">
              <CollapsibleTrigger className="flex w-full cursor-pointer items-center overflow-hidden py-2 transition-opacity hover:opacity-80">
                <Info
                  className={cn(
                    "mr-2 size-4 shrink-0 text-[var(--color-muted-300)]",
                    isExpanded && "text-[var(--color-primary-hover)]"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <span className="text-base leading-tight font-bold whitespace-normal">
                    {row.nome}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "ml-2 size-4 shrink-0 text-[var(--color-text-muted)] transition-transform duration-300",
                    isExpanded && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="pb-4 pr-2 pl-12 max-sm:pl-8">
                  <Separator className="my-2 opacity-30" />
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {row.subTesto || i18n._("no_descrizione")}
                  </p>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      },
    },
    {
      field: "actions",
      headerName: i18n._("azioni"),
      flex: 1,
      minWidth: 100,
      sortable: false,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => {
        const item = params.row;
        const pulsantiAzione = props.schedule.pulsanti
          .filter((p) => p.nome.toUpperCase() !== "NEW" && p.nome.toUpperCase() !== "RED")
          .map((p) => ({
            ...p,
            funzione: () => p.funzione(item._id),
          }));

        return (
          <div className="flex h-full items-center justify-end gap-1">
            <Button pulsanti={pulsantiAzione} />
          </div>
        );
      },
    },
  ];

  const rows = useMemo(
    () =>
      props.schedule.schedule.map((item) => ({
        id: item._id,
        ...item,
      })),
    [props.schedule.schedule]
  );

  return (
    <div className="box-border h-[550px] w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-sm)] [&_.MuiDataGrid-main]:min-h-[300px]">
      <DataGrid
        rows={rows}
        columns={columns}
        loading={false}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        pulsanti={pulsantiToolbar}
        toolbarColumnSplit={{ mainFlex: 11, actionFlex: 1, mainMinWidth: 150, actionMinWidth: 100 }}
      />
    </div>
  );
});

export default Schedule;
