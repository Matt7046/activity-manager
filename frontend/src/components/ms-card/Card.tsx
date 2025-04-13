import {
  CardActions,
  CardContent,
  CardMedia,
  List,
  Card as MuiCard,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { observer } from 'mobx-react';
import React from 'react';
import { Pulsante } from '../ms-button/Button';
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
  pulsanti: Pulsante[];
  className?: string;
  handleClick?: () => void;
}

const CardComponent = observer((props: CardProps) => {
  const propsCard = { ...props };
  if (propsCard.text.text.length > 8) {
    let cardTextAlign = propsCard.text.text.slice(0, 8);
    cardTextAlign = cardTextAlign.concat({ textLeft: '...' });
    propsCard.text.text = cardTextAlign;
  }

  return (
    <MuiCard className="card">
      <CardMedia
        className={props.className ? props.className : 'card-media'}
        image={props.img}
        title={props.title}
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
