import React from 'react';
import { Button, Form, FormGroup, FormControl, Grid, Col, Row, Glyphicon, Popover, OverlayTrigger } from 'react-bootstrap'; 
import StarRatingComponent from 'react-star-rating-component';

class PersonalComments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      personalValue: 'Your own comment...',
      doEdit: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      personalValue: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state.personalValue);
    this.props.handlePersonalDescription(this.props.beer.beer_id, this.state.personalValue);
    this.setState({
      doEdit:false,
    });
  }

  handleEdit() {
    this.setState({
      doEdit: !this.state.doEdit,
    });
  }

  render() {
    return (
      <div className="PersonalCommentsContainer">
        Rating:
        <StarRatingComponent 
          name="beerRating" 
          starCount={5}
          value={this.props.beer.beer_rating}
          onStarClick={this.props.onStarClick.bind(this, this.props.beer.beer_id)}
        />
        {(this.props.beer.beer_personalDescription.length === 0 || this.state.doEdit) && (
          <Form onSubmit={(e) => this.handleSubmit(e)}
          >
            <FormGroup controlId="formControlsTextarea">
              <FormControl  
                componentClass="textarea" 
                style={{ height: 100 }}
                placeholder={this.state.personalValue}
                onChange={this.handleChange}
              />
              <Button type="submit">Submit</Button>
            </FormGroup>
          </Form>) ||
          <div>
            {this.props.beer.beer_personalDescription.length > 0 && <span>{this.props.beer.beer_personalDescription}</span>}
            <Button onClick={() => this.handleEdit()} className="beerDetails">
              <Glyphicon className="personalEdit" glyph="pencil" />
            </Button> 
          </div>
        }
      </div>
    )
  }
}

export default PersonalComments;