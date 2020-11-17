import './App.css';
import { withAuthenticator, AmplifyAuthenticator } from '@aws-amplify/ui-react';
import React, {Component} from 'react';
import { Container, Divider, Grid, Header, Image } from 'semantic-ui-react'
import {Auth} from 'aws-amplify';
import S3Upload from "./Components/S3Upload/S3Upload";
import S3Table from "./Components/S3Table/S3Table";
import Navbar from "./Components/Navbar/Navbar";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {username: ""};

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    try{
      const user = await Auth.currentAuthenticatedUser();
      this.setState({username: user.username});
    } catch (err) {
      console.log("ERROR : ", err);
    }
  }
  
  render() {
      const {username} = this.state;
    return(
      <div className="App">
          <Grid>
                  <Navbar username={username} />
                 <Grid.Row>
                     <Grid.Column>
                         <br/>
                         <br/>
                     </Grid.Column>
                 </Grid.Row>
              <Grid.Row columns={3}>
                  <Grid.Column width={6}>
                      <S3Upload />
                  </Grid.Column>
                  <Grid.Column width={1}></Grid.Column>
                  <Grid.Column width={9}>
                      <S3Table />
                  </Grid.Column>
              </Grid.Row>
          </Grid>
          <Grid>
              <Grid.Row>
                  <Grid.Column>
                      <Divider/>
                      Footer
                  </Grid.Column>
              </Grid.Row>
          </Grid>
      </div>
    )
  }
}
export default withAuthenticator(App);
