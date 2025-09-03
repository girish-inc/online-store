import React from 'react';
import { Spinner } from 'react-bootstrap';

const ButtonLoader = ({ size = 'sm' }) => {
  return (
    <Spinner
      as="span"
      animation="border"
      size={size}
      role="status"
      aria-hidden="true"
    />
  );
};

export default ButtonLoader;