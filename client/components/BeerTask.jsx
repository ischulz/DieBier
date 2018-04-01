import React from 'react';
import { Button, Form, FormGroup, FormControl, Grid, Col, Row, Glyphicon } from 'react-bootstrap'; 

const BeerTask = ((props) => (
  <div className="taskContainer">
    <Button className="addButton" onClick={() => props.addToList(props.beer.id, props.isLiked)}>
      <Glyphicon className={props.isLiked ? "glyMinus" : "glyPlus"} glyph={props.isLiked ? "minus" : "plus"} />
    </Button>
    <Grid>
      <Row className="taskHead show-grid">
        <Col md={2} lg={2} className="taskHead_picture">
          <img width={65} height={65} src={props.beer.picture} />
        </Col>
        <Col md={10} lg={10} className="taskHead_overview">
          <div>{props.beer.name}</div>
          <div>{props.beer.abv}%</div>
          <div>{props.beer.styleName}</div>
        </Col>
      </Row>
      <Row>
      <Col md={12} className="taskBody">
        <div>{props.beer.description}{props.beer.detail}</div>
      </Col>
      </Row>
    </Grid>
  </div>
));

export default BeerTask;
