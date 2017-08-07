import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Button = styled.button`
  background-color: ${props => (props.side === 'left' ? '#f1f0f0' : '#0084f4')};
  color: #fff;
  border: 0;
  margin: 5px;
  padding: 10px;
`;

export default function ButtonMessage({ text }) {
  return (
    <Button>
      {text}
    </Button>
  );
}

ButtonMessage.propTypes = {
  text: PropTypes.string.isRequired,
};
