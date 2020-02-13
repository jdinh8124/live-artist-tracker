import React from 'react';

// getTopArtist(){
//   //curl -X "GET" "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10&offset=5" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer BQDZ1PLW6Dh4kq5BefpsZEbeyfYSEoigmWnkZDEAl6fB5e3MgE47pC2NSkVy_btJsLMBKXIupF0kFAjoCEbYIVgwAFhi_G2fZroNLotLxUi-pVXi9mUTBNPFXdmhiAGEC3PrnsDjKo3BMY2_sUMWSyqm"
// }

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

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
        console.log(myJson);
      });
  }

  render() {
    return <h1>Hello</h1>;
  }
}
