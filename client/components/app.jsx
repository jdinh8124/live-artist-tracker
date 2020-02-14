import React from 'react';
import Header from './header';
import AllArtists from './allartists';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artists: []
    };
    this.getAllArtist = this.getAllArtist.bind(this);
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

  cardsReady() {
    if (this.state.artists.length > 0) {
      return <AllArtists artists={this.state.artists} />;
    }

  }

  render() {
    return (
      <>
        <Header/>
        {this.cardsReady()}
      </>
    );
  }
}
