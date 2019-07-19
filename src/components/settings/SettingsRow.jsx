import React, { Component } from 'react';

export default class SettingsRow extends Component {
  refreshMaze = () => {
    window.location.reload();
  };

  render = () => {
    return (
      <div className="three ui buttons">
        <button type="button" className="massive ui inverted violet icon button">
          <i className="large flag checkered icon" />
        </button>
        <button onClick={this.refreshMaze} type="button" className="massive ui inverted purple icon button">
          <i className="large vertically flipped recycle icon" />
        </button>
        <button type="button" className="massive ui inverted teal icon button">
          <i className="large ellipsis horizontal icon" />
        </button>
      </div>
    );
  };
}
