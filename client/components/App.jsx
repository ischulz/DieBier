import React from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Header from './Header.jsx';
import SearchBar from './SearchBar.jsx';
import BeerTask from './BeerTask.jsx';
import MyList from './MyList.jsx';
import BreweryTask from './BreweryTask.jsx';
import { Button, Grid, Row, Col, code } from 'react-bootstrap';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      currentBeers: [],
      currentBreweries: [],
      likedBeers: [],
    };

    this.fetchBeerByName = this.fetchBeerByName.bind(this);
    this.searchBeerByName = this.searchBeerByName.bind(this);
    this.fetchAllBeersInList = this.fetchAllBeersInList.bind(this);
    this.addBeerToList = this.addBeerToList.bind(this);
  }

  componentWillMount() {
    this.fetchAllBeersInList();
  }

  fetchAllBeersInList() {
    axios.get(`/api/allBeers`)
    .then((response) => {
      console.log(response);
      let likedBeers = [];
      for(let i = 0; i < response.data.length; i++) {
        likedBeers.push(response.data[i].beer_id);
      }
      this.setState({
        likedBeers: likedBeers,
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  fetchBeerByName(name) {
    axios.get(`/api/name/${name}`)
    .then((response) => {
      console.log(response);
      let curBeers = [];
      let curBreweries = [];
      for(let i = 0; i < response.data.length; i++) {
        if(response.data[i].type === 'beer') {
          let newBeer = {
            id: response.data[i].id,
            name: response.data[i].name,
            abv: response.data[i].abv,
            description: response.data[i].description || response.data[i].style.description,
            styleName: response.data[i].style.name || null,
            picture: response.data[i].labels && response.data[i].labels.icon || 'https://i.imgur.com/wUogHsD.png' ,
          }
          if(this.state.currentBeers.indexOf(newBeer) === -1) {
            curBeers.push(newBeer);
          }
        }else if(response.data[i].type === 'brewery') {
          let newBrewery = {
            id: response.data[i].id,
            name: response.data[i].name,
            established: response.data[i].established,
            description: response.data[i].description,
            website: response.data[i].website,
            picture: response.data[i].images && response.data[i].images.medium || 'https://i.imgur.com/wUogHsD.png' ,
          }
          if(this.state.currentBreweries.indexOf(newBrewery) === -1) {
            curBreweries.push(newBrewery);
          }
        }
      }
      this.setState({
        currentBeers: curBeers,
        currentBreweries: curBreweries,
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  fetchBeerPicture(id, newBeer) {
    axios.get(`/api/picture/${id}`)
    .then((response) => {
      let curBeers = this.state.currentBeers;
      newBeer.picture = response.data.labels.icon;
      newBeer.detail = response.data.style.description;
      curBeers.push(newBeer);
      this.setState({
        currentBeers: curBeers
      });
    })
    .catch((error) => {
      console.log(error);
    })
  }

  searchBeerByName(name) {
    if(name !== '') {
      this.fetchBeerByName(name);
    }
  }

  addBeerToList(id, isLiked) {
    let likedBeers = [...this.state.likedBeers];
    if(!isLiked) {
      likedBeers.push(id);
      this.setState({
        likedBeers: likedBeers,
      });
      axios.post(`/api/addBeer/${id}`)
      .then((response) => {
        console.log(likedBeers);
      })
      .catch((error) => {
        console.log('Already in List');
      })
    } else {
      let itemIndex = likedBeers.indexOf(id);
      likedBeers.splice(itemIndex, 1);
      this.setState({
        likedBeers: likedBeers,
      });
      axios.delete(`/api/removeBeer/${id}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log('Already in List');
      })
    }
  }

  render() {
    return (
      <div className="main">
        <Header />
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={8} mdOffset={2} lg={6} lgOffset={3}>
              <SearchBar searchBeer={this.searchBeerByName}/>
              <div className="foundBeers">
              {this.state.currentBeers.length > 0 && this.state.currentBeers.map((item, index) => {
                return  <div key={index}>
                          <BeerTask 
                            isLiked={!!((this.state.likedBeers).indexOf(item.id) + 1)}
                            beer={item} 
                            addToList={this.addBeerToList}
                          />
                        </div>
              })}
              {this.state.currentBreweries.length > 0 && this.state.currentBreweries.map((item, index) => {
                return  <div key={index}>
                          <BreweryTask 
                            brewery={item} 
                          />
                        </div>
              })}
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
export default App;
