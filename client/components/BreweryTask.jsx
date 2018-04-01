import React from 'react';
import { Button, Form, FormGroup, FormControl, Grid, Col, Row } from 'react-bootstrap'; 

const BreweryTask = ((props) => (
  <div className="taskContainer">
    <div className="breweryImage_container">
      <img className="brewery_picture" height={100} src={props.brewery.picture} />
    </div>
    <div>{props.brewery.name}</div>
    <div>Established in {props.brewery.established}</div>
    <div><a href={props.brewery.website}>{props.brewery.website}</a></div>
    <div className="taskBody">{props.brewery.description || 'There is no description for this Brewery because it isn\'t german I guess'}</div>
  </div>
));

export default BreweryTask;
