import React from 'react';
import Header from './Header.jsx';
import ListedBeer from './ListedBeer.jsx';
import axios from 'axios';
import { Button, Form, FormGroup, FormControl, Grid, Col, Row, Glyphicon } from 'react-bootstrap'; 
import StarRatingComponent from 'react-star-rating-component';

class MyList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myBeers: [],
    }
    this.fetchAllBeersInList = this.fetchAllBeersInList.bind(this);
    this.handleDrinking = this.handleDrinking.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.deleteBeerInList = this.deleteBeerInList.bind(this);
    this.updateBeerInList = this.updateBeerInList.bind(this);
    this.onStarClick = this.onStarClick.bind(this);
    this.handlePersonalDescription = this.handlePersonalDescription.bind(this);
  }

  componentWillMount() {
    this.fetchAllBeersInList();
  }

  deleteBeerInList(id) {
    axios.delete(`/api/removeBeer/${id}`)
    .then((response) => {
      console.log('Deleted', response);
    })
    .catch((error) => {
      console.log('Error', error);
    })
  }

  fetchAllBeersInList() {
    axios.get(`/api/allBeers`)
    .then((response) => {
      console.log(response);
      let likedBeers = [];
      for(let i = 0; i < response.data.length; i++) {
        likedBeers.push(response.data[i]);
      }
      this.setState({
        myBeers: likedBeers,
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  updateBeerInList(id, what, how) {
    axios.put(`/api/beerUpdate/${id}`, {
      what: what,
      how: how,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  handleDrinking(id) {
    let myBeers = [...this.state.myBeers];
    let curBeerStat;
    for(let i = 0; i < myBeers.length; i++) {
      if(myBeers[i].beer_id === id) {
        myBeers[i].beer_drankIt = !myBeers[i].beer_drankIt;
        curBeerStat = myBeers[i].beer_drankIt;
      }
    }
    this.setState({
      myBeers: myBeers,
    });
    this.updateBeerInList(id, 'beer_drankIt', curBeerStat);
  }

  handleDelete(id) {
    let myBeers = [...this.state.myBeers];
    for(let i = 0; i < myBeers.length; i++) {
      if(myBeers[i].beer_id === id) {
        myBeers.splice(i, 1);
      }
    }
    this.setState({
      myBeers: myBeers,
    });
    this.deleteBeerInList(id);
  }

  onStarClick(id, nextValue, prevValue, name) {
    let myBeers = [...this.state.myBeers];
    for(let i = 0; i < myBeers.length; i++) {
      if(myBeers[i].beer_id === id) {
        myBeers[i].beer_rating = nextValue;
      }
    }
    this.setState({
      myBeers: myBeers,
    });
    this.updateBeerInList(id, 'beer_rating', nextValue);
  }

  handlePersonalDescription(id, text) {
    let myBeers = [...this.state.myBeers];
    for(let i = 0; i < myBeers.length; i++) {
      if(myBeers[i].beer_id === id) {
        myBeers[i].beer_personalDescription = text;
      }
    }
    this.updateBeerInList(id, 'beer_personalDescription', text);
  }

  render() {
    return (
      <div>
        <Header />
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={8} mdOffset={2} lg={6} lgOffset={3}>
              <div className="listedBeers_container">
                {this.state.myBeers.length > 0 &&  this.state.myBeers.map((item, index) => {
                  return (
                    <div key={index}>
                      <ListedBeer 
                        beer={item} 
                        handleDrinking={this.handleDrinking} 
                        handleDelete={this.handleDelete}
                        onStarClick={this.onStarClick}
                        handlePersonalDescription={this.handlePersonalDescription}
                      />
                    </div>
                  )
                })}
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default MyList;
