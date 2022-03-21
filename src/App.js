import React from 'react';

import './App.css';

import NamesContainer from './NamesContainer';

const init = ['A', 'B', 'C', 'D', 'E'];
class App extends React.Component {
  state = {
    names: [...init],
    searchTerm: '',
    foundAlbums: [],
  };

  onKeyPress = (e) => {
    const searchTerm = e.target.value;

    if(e.key === 'Enter'){
      if (!searchTerm) {
        this.setState({ names: [...init] });
      } else {
        fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=album`)
          .then((res) => res.json())
          .then((res) => {
            const albumNames = (res.results)
              ?.sort((a, b) =>
                (a.collectionName).localeCompare(b.collectionName)
              )
              .slice(0, 5)
              .map((album) => album.collectionName);
            this.setState({ foundAlbums: albumNames });
          })
          .catch((err) => {
            console.error(err);
            this.setState({ foundAlbums: [] });
          });
      }
    }
  };

  dynamicSearch = () => {
    return this.state.names.filter((name) =>
      name.toLowerCase().includes(this.state.searchTerm.toLowerCase())
    );
  };

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => {
        let name = prevState.names.shift();

        let foundAlbums = prevState.foundAlbums;
        if (foundAlbums.length) {
          name = foundAlbums.shift();
          foundAlbums = [...foundAlbums, name];
        }

        const names = [...prevState.names, name];
        return {
          names,
          foundAlbums,
        };
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }


  render() {
    return (
      <div style={{ textAlign: 'center', paddingTop: '30vh' }}>
        <input
          type="text"
          onKeyPress={this.onKeyPress}
          placeholder="Search Band"
        />
        <br></br>
        <NamesContainer names={this.dynamicSearch()} />
      </div>
    );
  }
}

export default App;
