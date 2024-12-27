import { CardActions, CardContent, CardMedia, Grid, List, ListItem, Card as MuiCard, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React from 'react';
import { Pulsante } from '../msbutton/Button';


export interface CardProps {
  children?: React.ReactNode 
  _id: string;
  text: string[]; // Può essere un array JSON serializzato o una stringa delimitata
  title: string;
  img: string;
  pulsanti: Pulsante[];
  className?: string;
  handleClick?: () => void;
}

const CardComponent = observer((props: CardProps) => {

  return (
    <MuiCard
      sx={{
        maxWidth: 345,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%', // Allinea l'altezza delle card,
        borderRadius: 4,
        boxShadow: 3,
        overflow: 'hidden',
        backgroundColor: '#f9f9f9',
      }}
    >
      <CardMedia
        sx={{ height: 140 }}
        image={props.img}
        title={props.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ minHeight: 56 }}>
          {props.title}
        </Typography>
        {/* Render condizionale del contenuto */}
        {props.text.length > 1 ? (
          <List>
            {props.text.map((item, index) => (
              <ListItem key={index} sx={{ padding: 0 }}>
                - {item}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {props.text}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Grid container justifyContent="flex-end" spacing={2}>
          <Grid item>
          <div>{props.children}</div>          
          </Grid>
        </Grid>
      </CardActions>
    </MuiCard>
  );
});

const CardGrid = ({ cardsData }: { cardsData: CardProps[] }) => {
  return (
    <Grid container spacing={2} alignItems="stretch">
      {cardsData.map((cardData) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={cardData._id}>
          <CardComponent {...cardData} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CardGrid;

