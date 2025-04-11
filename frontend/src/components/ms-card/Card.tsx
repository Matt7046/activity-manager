import {
  CardActions,
  CardContent,
  CardMedia,
  List,
  ListItem,
  Card as MuiCard,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { observer } from 'mobx-react';
import React from 'react';
import { Pulsante } from '../ms-button/Button';
import './Card.css'; // <-- Import del CSS

export interface CardProps {
  children?: React.ReactNode;
  _id: string;
  text: string[];
  title: string;
  img: string;
  pulsanti: Pulsante[];
  className?: string;
  handleClick?: () => void;
}

const CardComponent = observer((props: CardProps) => {
  return (
    <MuiCard className="card">
      <CardMedia
        className="card-media"
        image={props.img}
        title={props.title}
      />
      <CardContent style={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" className="card-title">
          {props.title}
        </Typography>
        {props.text.length > 1 ? (
          <List>
            {props.text.map((item, index) => (
              <ListItem key={index} className="card-list-item">
                - {item}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" className="card-text-secondary">
            {props.text}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Grid container justifyContent="flex-end" spacing={2}>
          <div>{props.children}</div>
        </Grid>
      </CardActions>
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
