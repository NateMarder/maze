import React from 'react';
import GameContainer from './maze/containers/GameContainer';
import './App.css';

export default class App extends React.Component {
  render = () => {
    return (
      <div className="column">
        <GameContainer />
      </div>
    );
  };
}
