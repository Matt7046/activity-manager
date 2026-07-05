"use client";
import { Trans } from "@lingui/react";
import { Menu } from "lucide-react";
import { observer } from "mobx-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { MenuIconComponent } from "@/general/structure/menuIcons";
import { cn } from "@/lib/utils";

type Anchor = "top" | "left" | "bottom" | "right";

export interface MenuLaterale {
  funzione?: ((...args: unknown[]) => unknown) | null;
  testo: string;
  path?: string;
  annotazione?: string;
  icon?: MenuIconComponent;
}

export interface TypeAnchor {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
}

const Drawer = observer(
  (props: {
    sezioni: MenuLaterale[][];
    nameMenu: string;
    route?: string;
    anchor: Anchor;
  }) => {
    const [statoComponente, setStatoComponente] = React.useState<TypeAnchor>({
      top: false,
      left: false,
      bottom: false,
      right: false,
    });

    const isOpen = statoComponente[props.anchor];
    const setOpen = (open: boolean) => {
      setStatoComponente({ ...statoComponente, [props.anchor]: open });
    };

    const sheetSide =
      props.anchor === "top"
        ? "top"
        : props.anchor === "bottom"
          ? "bottom"
          : props.anchor === "right"
            ? "right"
            : "left";

    return (
      <div>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-1.5 font-semibold text-[var(--color-primary)] normal-case transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-soft)]"
        >
          <Menu className="size-5" />
        </Button>

        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetContent
            side={sheetSide}
            className={cn(
              "flex flex-col overflow-y-auto border-[var(--color-border)] bg-[var(--color-surface)] p-0",
              props.anchor === "left" || props.anchor === "right" ? "w-[280px] sm:max-w-[280px]" : "w-auto"
            )}
          >
            {listaItem(props.anchor, props.sezioni, () => setOpen(false))}
          </SheetContent>
        </Sheet>
      </div>
    );
  }
);

const listaItem = (
  anchor: Anchor,
  sezioni: MenuLaterale[][],
  closeDrawer: () => void
) => (
  <div
    className={cn(
      "flex h-full flex-col",
      anchor === "top" || anchor === "bottom" ? "w-auto" : "w-full"
    )}
    role="presentation"
    onClick={closeDrawer}
    onKeyDown={(event) => {
      if (event.key === "Escape") closeDrawer();
    }}
  >
    <SheetHeader className="border-b border-[var(--color-border)] px-4 py-3 text-left">
      <SheetTitle className="text-left text-lg font-bold">
        <Trans id="menu_navigazione" />
      </SheetTitle>
    </SheetHeader>

    {sezioni.map((section, sectionIndex) => (
      <React.Fragment key={sectionIndex}>
        <ul className="py-1">
          {section.map((menulaterale) => (
            <li key={menulaterale.testo}>
              <button
                type="button"
                className="mx-2 my-1 flex w-[calc(100%-16px)] items-center rounded-[var(--radius-sm)] px-3 py-2 text-left text-[0.9rem] font-medium transition-all hover:bg-[var(--color-info-soft)] hover:text-[var(--color-primary)]"
                onClick={(event) => {
                  event.stopPropagation();
                  if (menulaterale.funzione) {
                    menulaterale.funzione();
                  }
                  closeDrawer();
                }}
              >
                <span className="mr-2 flex min-w-10 items-center justify-center text-[var(--color-primary)]">
                  {menulaterale.icon && <menulaterale.icon className="size-4" />}
                </span>
                {menulaterale.testo}
              </button>
            </li>
          ))}
        </ul>
        {sectionIndex !== sezioni.length - 1 && (
          <Separator className="mx-4 my-2 bg-[var(--color-border)]" />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default Drawer;
