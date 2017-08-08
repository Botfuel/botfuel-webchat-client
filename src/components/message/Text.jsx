import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Text = styled.div`
  font-size: 15px;
  font-weight: 300;
`;

export default function TextMessage({ value }) {
  return (
    <Text>
      {value}
    </Text>
  );
}

TextMessage.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]).isRequired,
};
