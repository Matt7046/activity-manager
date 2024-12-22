import { Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import Button, { Pulsante } from '../msbutton/Button';


interface cardProps {
  _id: string;
  text: string;
  title: string;
  img: string;
  pulsanti: Pulsante[];
  className?: string;
  handleClick?: () => void;
}

const CardComponent = observer((props: cardProps) => {
  return (
    <Card 
      sx={{ 
        maxWidth: 345,      
        height: '100%' 
      }}
    >
      <CardMedia
        sx={{ height: 140 }}
        image={props.img}
        title={props.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {props.text}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid container justifyContent="flex-end" spacing={2}>
          <Grid item>
            <Button pulsanti={props.pulsanti} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
});

const CardGrid = ({ cardsData }: { cardsData: cardProps[] }) => {
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
