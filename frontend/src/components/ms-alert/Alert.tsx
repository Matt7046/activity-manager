"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import { TypeAlertColor } from "../../general/structure/Constant";
import { TypeMessage } from "../../page/page-layout/PageLayout";
import { Alert as ShadcnAlert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AlertConfig {
  open: boolean;
  message: TypeMessage;
  setOpen: (open: boolean) => void;
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>;
}

interface CustomAlertProps {
  message: TypeMessage;
  onClose: () => void;
}

const severityStyles: Record<string, string> = {
  success:
    "border-emerald-500/40 bg-emerald-500/15 text-emerald-100 shadow-[0_8px_24px_rgba(52,211,153,0.2)]",
  error:
    "border-red-500/40 bg-red-500/15 text-red-100 shadow-[0_8px_24px_rgba(248,113,113,0.2)]",
  warning:
    "border-amber-500/40 bg-amber-500/15 text-amber-100 shadow-[0_8px_24px_rgba(251,191,36,0.2)]",
  info: "border-blue-500/40 bg-blue-500/15 text-blue-100 shadow-[0_8px_24px_rgba(96,165,250,0.2)]",
};

const Alert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const severity = (message.typeMessage?.toLowerCase() || "info") as keyof typeof severityStyles;

  return (
    <div
      className="alert-snackbar-custom fixed top-5 right-5 z-[9999] min-w-[320px] max-w-[450px] animate-[slideInRight_0.4s_ease-out]"
      role="status"
    >
      <ShadcnAlert
        className={cn(
          "relative w-full rounded-2xl border px-4 py-3",
          severityStyles[severity] ?? severityStyles.info
        )}
      >
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="absolute top-2 right-2 text-inherit hover:bg-white/10"
          aria-label="Close"
        >
          <X className="size-4" />
        </Button>
        <div className="flex flex-col pr-8">
          <AlertTitle className="mb-1 text-sm font-extrabold uppercase">
            {message.titleMessage}
          </AlertTitle>
          {message?.message?.map((msg, index) => (
            <AlertDescription key={index} className="text-sm opacity-90">
              {msg}
            </AlertDescription>
          ))}
        </div>
      </ShadcnAlert>
    </div>
  );
};

export default Alert;
