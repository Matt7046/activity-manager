import {
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  List,
  Card as MuiCard,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import { IMAGE } from '../../general/structure/Constant';
import './Card.css'; // <-- Import del CSS

export interface CardText {
  textLeftTitle: string;
  textRightTitle?: string;
  text: CardTextAlign[]
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
  loadImage: (...args: any[]) => Promise<string>
  className?: string;
  handleClick?: () => void;
}


export interface NameFile {
  name?: string;
  change: boolean
}


let selectedFile: File | undefined;


const CardComponent = observer((props: CardProps) => {


  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string>();

  const propsCard = { ...props };
  useEffect(() => {
  if (propsCard.img) {
      setImage(IMAGE.SERVER + propsCard.img);
    }
  }, [propsCard.img]);

  if (propsCard.text.text.length > 8) {
    let cardTextAlign = propsCard.text.text.slice(0, 8);
    cardTextAlign = cardTextAlign.concat({ textLeft: '...' });
    propsCard.text.text = cardTextAlign;
  }



  // Funzione chiamata quando si clicca su CardActionArea
  const handleClickOpen = (props: CardProps) => {
    // Crea una funzione che utilizza esempioFunzione con loadImage e selectedFile
    creaFormData(props.loadImage, selectedFile)


    // Esegui resizeImage, passando la funzione loadImage come primo parametro
    //  resizeImage(props.loadImage);
  };


  // Gestisce la selezione del file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];   
    selectedFile = file;
    handleClickOpen(props);
  };

  // Funzione che sostituisce il primo parametro di loadImage con imageDTO
  const creaFormData = (loadImage: (imageDTO: FormData) => Promise<string>, selectedFile: File | undefined) => {
    if (selectedFile) {
      const fileName = selectedFile?.name;
      const extension = fileName?.substring(fileName.lastIndexOf('.'));
      // Crea l'oggetto imageDTO
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append("width", "400");
      formData.append("height", "200");
      formData.append("extension", extension);
      // Passa l'oggetto imageDTO alla funzione loadImage
      loadImage(formData).then(url => {
        setImage(IMAGE.SERVER + url);
      })
    } else {
      alert("Seleziona un file prima di inviare.");
    }
  };

  const getNameFile = (img: any, selectedFile: File | undefined) => {
    const fileName = selectedFile?.name;
    const extension = fileName?.substring(fileName.lastIndexOf('.'));
    return img + extension;
  }

  return (
    <MuiCard className="card">
      <CardActionArea onClick={() => {
        fileInputRef.current?.click();
      }
      }>
        <CardMedia
          className={props.className ?? 'card-media'}
          image={image}
          title={props.title}
        />
      </CardActionArea>
      <input
        id="file-upload"
        type="file"
        hidden
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e)}
      />
      <CardContent className='card-content'>
        <Typography gutterBottom variant="h5" component="div" className="card-title">
          {props.title}
        </Typography>
        <List className='list-body'>
          <Grid container className="card-header-row" justifyContent="space-between" alignItems="center">
            <Grid size={{ xs: 6, sm: 6 }}>
              <Typography className="card-header-text">
                {propsCard.text.text.length > 0 ? propsCard.text.textLeftTitle : ''}
              </Typography>
            </Grid>
            {propsCard.text.text.length > 0 && propsCard.text.text[0].textRight && (
              <Grid size={{ xs: 6, sm: 6 }}>
                <Typography className="card-header-text">
                  {propsCard.text.textRightTitle}
                </Typography>
              </Grid>
            )}
          </Grid>

          {(propsCard.text.text.length > 0
            ? propsCard.text.text
            : [{ textLeft: "", textRight: "" }]
          ).map((item: CardTextAlign, index: number) => (
            <Grid container key={index} justifyContent="space-between" alignItems="center">
              <Grid size={{ xs: item.textRight ? 6 : 12, sm: item.textRight ? 6 : 12 }}>
                <Typography className="card-list-item">{item.textLeft}</Typography>
              </Grid>
              {item.textRight && (
                <Grid size={{ xs: 6, sm: 6 }}>
                  <Typography className="card-list-item">{item.textRight}</Typography>
                </Grid>
              )}
            </Grid>
          ))}
        </List>


        <CardActions className="card-actions-bottom">
          <Grid container justifyContent="flex-end" spacing={2}>
             <div>{props.children}</div>
          </Grid>
        </CardActions>
      </CardContent>

    </MuiCard>
  );
});


const CardGrid = ({ cardsData }: { cardsData: CardProps[] }) => {
  return (
    <Grid container spacing={2} alignItems="stretch">
      {cardsData.map((cardData) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={cardData._id}>
          <CardComponent {...cardData} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CardGrid;
