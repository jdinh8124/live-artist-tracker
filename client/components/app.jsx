import React from 'react';
import Header from './header';
import AllArtists from './allartists';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artists: []
    };
  }

  componentDidMount() {
    this.getAllArtist();
  }

  getAllArtist() {
    fetch('/api/getTop').then(response => {
      return response.json();
    })
      .then(myJson => {
        this.setState({ artists: myJson });
        console.log(myJson);
      });
  }

  render() {
    return (
      <>
        <Header/>
        <AllArtists artists={this.state.artists}/>
      </>
    );
  }
}
