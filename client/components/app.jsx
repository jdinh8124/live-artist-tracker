import React from 'react';
import Header from './header';
import AllArtists from './allartists';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artists: [],
      chosenArtist: []
    };
    this.getAllArtist = this.getAllArtist.bind(this);
    this.getOneArtist = this.getOneArtist.bind(this);
  }

  componentDidMount() {

  }

  getAllArtist() {
    fetch('/api/getTop').then(response => {
      return response.json();
    })
      .then(myJson => {
        this.setState({ artists: myJson });
      });
  }

  cardsReady() {
    if (this.state.artists.length > 0) {
      return <AllArtists artists={this.state.artists} />;
    }
  }

  getOneArtist() {
    fetch('/api/artists').then(response => {
      return response.json();
    });
  }

  render() {
    return (
      <>
        <Header/>
        <button onClick={this.getOneArtist}>Test Illenium</button>
        {this.cardsReady()}
        {this.getOneArtist()}
      </>
    );
  }
}
