import React from 'react';

const SettingsRow = () => (
  <div className="three ui buttons">
    <button onClick={() => window.location.reload()} type="button" className="large ui inverted purple icon button">
      <i className="recycle icon"></i>
    </button>
  </div>
);

export default SettingsRow;
