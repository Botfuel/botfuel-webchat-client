import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primaryText};
  border: 0;
  margin: 5px;
  padding: 10px;
  border-radius: 7px;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
  &:focus {
    outline: none;
  }
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
