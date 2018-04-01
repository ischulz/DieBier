import React from 'react';
import PersonalComments from './PersonalComments.jsx';
import { Button, Form, FormGroup, FormControl, Grid, Col, Row, Glyphicon, Popover, OverlayTrigger } from 'react-bootstrap'; 

const popoverClickRootClose = (
  <Popover id="popover-trigger-click-root-close" title="Personal Info">
    <PersonalComments />
  </Popover>
);

const ListedBeer = ((props) => (
  <div className="listedBeerContainer">
    <div>
    <div className="listedBeer_image">
      <img width={65} height={65} src={props.beer.beer_picture} />
    </div>
    </div>
    <div className="listedBeer_title">
      {props.beer.beer_name}
    </div>
    <div className="listedBeer_buttons">
      <Button onClick={() => props.handleDrinking(props.beer.beer_id)}>
        <Glyphicon className={props.beer.beer_drankIt ? "okYes" : "okNo"} glyph="ok" />
      </Button>
      <Button onClick={() => props.handleDelete(props.beer.beer_id)}>
        <Glyphicon className="trash_button" glyph="trash" />
      </Button>
    </div>
    <div className="listedBeer_details">
     <OverlayTrigger 
      rootClose trigger="click" 
      placement="bottom" 
      overlay={  
        <Popover id="popover-trigger-click-root-close" title="Personal Info">
          <PersonalComments 
            onStarClick={props.onStarClick} 
            beer={props.beer}
            handlePersonalDescription={props.handlePersonalDescription}
          />
        </Popover>}>
      <Button className="beerDetails">
        <Glyphicon className="beer_details" glyph="menu-down" />
      </Button> 
    </OverlayTrigger> 
    </div>
  </div>
));

export default ListedBeer;