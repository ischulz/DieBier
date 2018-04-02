import React from 'react';
import Header form './Header.jsx';
import { Button, Form, FormGroup, FormControl, Grid, Col, Row, Glyphicon, Popover, OverlayTrigger } from 'react-bootstrap'; 

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginTest: '',
    };
  }


  render() {
    return (
      <div>
        <span>What do you wanna Login with?</span>
        <a href="/google/callback">Log In with Facebook</a>
      </div>
    )
  }
}

export default Login;