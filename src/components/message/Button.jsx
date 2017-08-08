import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Button = styled.button`
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.secondaryText};
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
