import React from 'react';

const SettingsRow = () => (
  <div className="three ui buttons">
    <button type="button" className="massive ui inverted violet icon button">
      <i className="large flag checkered icon" />
    </button>
    <button onClick={() => window.location.reload()} type="button" className="massive ui inverted purple icon button">
      <i className="large vertically flipped recycle icon" />
    </button>
    <button type="button" className="massive ui inverted teal icon button">
      <i className="large ellipsis horizontal icon" />
    </button>
  </div>
);

export default SettingsRow;
