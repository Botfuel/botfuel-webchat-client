import React from 'react';
import PropTypes from 'prop-types';

export default function TextMessage({ value }) {
  return (
    <div>
      {value}
    </div>
  );
}

TextMessage.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]).isRequired,
};
