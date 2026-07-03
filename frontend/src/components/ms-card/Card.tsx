"use client";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cloudinaryImageDeliveryUrl } from "../../general/structure/userPointImageSlots";
import { imageExtensionFromFile, prepareImageForUpload } from "../../general/structure/imageUpload";

export interface CardText {
  textLeftTitle: string;
  textRightTitle?: string;
  text: CardTextAlign[];
}

export interface CardTextAlign {
  textLeft: string;
  textRight?: string;
}

export interface CardProps {
  children?: React.ReactNode;
  _id: string;
  text: CardText;
  title: string;
  img: string;
  loadImage: (...args: any[]) => Promise<string>;
  className?: string;
  handleClick?: () => void;
}

export interface NameFile {
  name?: string;
  change: boolean;
}

let selectedFile: File | undefined;

const CardComponent = observer((props: CardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>();
  const propsCard = { ...props };

  useEffect(() => {
    if (propsCard.img) {
      setImage(cloudinaryImageDeliveryUrl(propsCard.img));
    }
  }, [propsCard.img]);

  if (propsCard.text.text.length > 8) {
    let cardTextAlign = propsCard.text.text.slice(0, 8);
    cardTextAlign = cardTextAlign.concat({ textLeft: "..." });
    propsCard.text.text = cardTextAlign;
  }

  const handleClickOpen = (props: CardProps) => {
    creaFormData(props.loadImage, selectedFile);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.files?.[0];
    if (!raw) return;
    try {
      selectedFile = await prepareImageForUpload(raw);
      handleClickOpen(props);
    } finally {
      event.target.value = "";
    }
  };

  const creaFormData = (
    loadImage: (imageDTO: FormData) => Promise<string>,
    selectedFile: File | undefined
  ) => {
    if (selectedFile) {
      const extension = imageExtensionFromFile(selectedFile);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("width", "400");
      formData.append("height", "200");
      formData.append("extension", extension);
      loadImage(formData).then((url) => {
        setImage(cloudinaryImageDeliveryUrl(url));
      });
    } else {
      alert("Seleziona un file prima di inviare.");
    }
  };

  const rows =
    propsCard.text.text.length > 0
      ? propsCard.text.text
      : [{ textLeft: "", textRight: "" }];

  return (
    <Card className="relative flex h-[540px] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-md)]">
      <button
        type="button"
        className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
        onClick={() => fileInputRef.current?.click()}
      >
        <div
          className={cn(
            "mx-3 mt-3 h-40 rounded-[var(--radius-lg)] bg-cover bg-center transition-transform duration-[600ms] group-hover/card:scale-[1.02]",
            props.className ?? "card-media"
          )}
          style={{ backgroundImage: image ? `url(${image})` : undefined }}
          title={props.title}
          role="img"
          aria-label={props.title}
        />
      </button>

      <input
        id="file-upload"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        ref={fileInputRef}
        onChange={(e) => void handleFileChange(e)}
      />

      <CardContent className="flex flex-1 flex-col overflow-hidden px-5 py-3">
        <h3 className="mb-3 flex min-h-[2.4em] items-center justify-center text-center text-[1.1rem] leading-tight font-extrabold text-[var(--color-text)] uppercase">
          {props.title}
        </h3>

        <div className="mt-1 h-60 overflow-hidden p-0">
          <div className="mb-2 flex h-[35px] items-center rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)] px-3">
            <div className="w-1/2">
              <span className="text-[0.65rem] font-extrabold tracking-wide text-[var(--color-text-muted)] uppercase">
                {propsCard.text.text.length > 0 ? propsCard.text.textLeftTitle : ""}
              </span>
            </div>
            {propsCard.text.text.length > 0 && propsCard.text.text[0].textRight && (
              <div className="w-1/2">
                <span className="text-[0.65rem] font-extrabold tracking-wide text-[var(--color-text-muted)] uppercase">
                  {propsCard.text.textRightTitle}
                </span>
              </div>
            )}
          </div>

          {rows.map((item: CardTextAlign, index: number) => (
            <div
              key={index}
              className={cn(
                "mb-0.5 flex h-[38px] items-center rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--color-info-soft)]",
                index % 2 === 0 ? "bg-[var(--color-surface-soft)]" : "bg-[var(--color-surface)]"
              )}
            >
              <div className={item.textRight ? "w-1/2" : "w-full"}>
                <span
                  className={cn(
                    "block overflow-hidden px-3 text-[0.85rem] text-ellipsis whitespace-nowrap text-[var(--color-text-muted)]",
                    item.textLeft === "..." && "text-center font-bold text-[var(--color-muted-300)]"
                  )}
                >
                  {item.textLeft}
                </span>
              </div>
              {item.textRight && (
                <div className="w-1/2">
                  <span className="block pl-2 text-left text-[0.85rem] font-bold text-[var(--color-text)]">
                    {item.textRight}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex h-[60px] items-center border-t border-[var(--color-border)] bg-[var(--color-surface-soft)] px-5 py-0">
        <div className="flex w-full items-center justify-end gap-2">{props.children}</div>
      </CardFooter>
    </Card>
  );
});

const CardGrid = ({ cardsData }: { cardsData: CardProps[] }) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {cardsData.map((cardData) => (
        <CardComponent key={cardData._id} {...cardData} />
      ))}
    </div>
  );
};

export default CardGrid;
