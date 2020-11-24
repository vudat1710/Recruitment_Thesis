import React from 'react';
import './Button.scss';

function Button({ isLoading, children, ...props }) {
  return (
    <button className="button" {...props}>
      {isLoading ? <div className="loader" /> : children}
    </button>
  );
}

export default Button;
