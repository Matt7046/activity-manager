import { Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import Button, { Pulsante } from '../msbutton/Button';


interface cardProps {
  _id: string;
  text: string;
  title: string;
  img: string;
  pulsanti:Pulsante[];
  className?: string;
  handleClick?: () => void;
}

const card = observer((props: cardProps) => {

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={props.img}
        title={props.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
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
  )
});

export default card;




