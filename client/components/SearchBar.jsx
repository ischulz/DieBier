import React from 'react';
import { Button, Form, FormGroup, FormControl } from 'react-bootstrap'; 

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  render() {
    return (
      <div className="searchContainer">
        <Form 
          inline
          onSubmit={(e) => {
            e.preventDefault();
            this.props.searchBeer(this.state.value);
          }}
        >
          <FormGroup controlId="formInlineName">
            <FormControl 
              type="text" 
              placeholder="Search for a Beer" 
              onChange={this.handleChange}
              />
          </FormGroup>{' '}
          <Button className="searchButton" type="submit">Save</Button>
        </Form>
      </div>
    );
  }
}

export default SearchBar;
