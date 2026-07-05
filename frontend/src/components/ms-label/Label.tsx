"use client";
import { observer } from "mobx-react";
import { cn } from "@/lib/utils";

type Visibility = "visible" | "hidden" | "collapse" | undefined;

interface LabelProps {
  _id: string;
  text: string;
  htmlFor?: string;
  onClick?: () => void;
  className?: string;
  isUnderlined?: boolean;
  visibility?: Visibility;
}

const Label = observer((props: LabelProps) => {
  return (
    <div className="max-w-full overflow-hidden" key={props._id}>
      <label
        id={`label-${props._id}`}
        htmlFor={props.htmlFor}
        className={cn(
          "label-text inline-block max-w-full overflow-hidden align-middle text-ellipsis whitespace-nowrap",
          props.htmlFor,
          props.className
        )}
        onClick={props.onClick}
        style={{
          textDecoration: props.isUnderlined ? "underline" : "none",
          visibility: props.visibility,
        }}
      >
        {props.text}
      </label>
    </div>
  );
});

export default Label;
