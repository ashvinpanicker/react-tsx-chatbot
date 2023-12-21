import React from 'react';
import './Loader.css';

// Made a react component with some CSS loaders
// https://loading.io/css/

const Loader = ({ type }) => {
  switch (type) {
    case 'ring':
      return (
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      );

    case 'ellipsis':
      return (
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      );

    case 'ripple':
    default:
      return (
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      );
  }
};

export default Loader;
