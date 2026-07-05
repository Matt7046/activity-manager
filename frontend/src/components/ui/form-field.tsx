"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormFieldProps = {
  id: string;
  label: string;
  className?: string;
  labelClassName?: string;
  multiline?: boolean;
  rows?: number;
} & (
  | (Omit<React.ComponentProps<"input">, "id"> & { multiline?: false })
  | (Omit<React.ComponentProps<"textarea">, "id"> & { multiline: true })
);

export function FormField({
  id,
  label,
  className,
  labelClassName,
  multiline,
  rows,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("form-control-operative w-full space-y-1", className)}>
      <Label htmlFor={id} className={cn("font-bold text-[var(--color-text)]", labelClassName)}>
        {label}
      </Label>
      {multiline ? (
        <Textarea id={id} rows={rows} className="w-full" {...(props as React.ComponentProps<"textarea">)} />
      ) : (
        <Input id={id} className="w-full" {...(props as React.ComponentProps<"input">)} />
      )}
    </div>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  className?: string;
  labelClassName?: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  toggleLabel: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  autoComplete?: string;
};

export function PasswordField({
  showPassword,
  onToggleVisibility,
  toggleLabel,
  id,
  label,
  className,
  labelClassName,
  value,
  onChange,
  disabled,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <div className={cn("form-control-operative relative w-full space-y-1", className)}>
      <Label htmlFor={id} className={cn("font-bold text-[var(--color-text)]", labelClassName)}>
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          className="w-full pr-10"
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={toggleLabel}
          onClick={onToggleVisibility}
          disabled={disabled}
          className="absolute top-1/2 right-1 -translate-y-1/2"
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
