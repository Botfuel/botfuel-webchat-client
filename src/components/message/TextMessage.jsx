import React from 'react';
import PropTypes from 'prop-types';

export default function TextMessage({ payload }) {
  return <div>{payload.textValue || payload.text}</div>;
}

TextMessage.propTypes = {
  payload: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]).isRequired,
};
