import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Bubble from './Bubble';

const Container = styled.div`
  text-align: right;
  > div {
    margin-left: ${props => 5 / props.size}%;
    width: ${props => 90 / props.size}%;
    max-width: 200px;
  }
`;
export default function ButtonList({ value }) {
  const choices = value.choices;
  return (
    <Container size={value.choices.length}>
      {choices && choices.map(choice => <ButtonMessage key={choice.id} text={choice.text} />)}
    </Container>
  );
}

const Button = Bubble.extend`
  text-align: center;
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary};
  cursor: pointer;
  width: 30%
  &:hover {
    background-color: ${props => props.theme.colors.secondaryLight};
  }
  &:focus {
    outline: none;
  }
`;

function ButtonMessage({ text }) {
  return (
    <Button>
      {text}
    </Button>
  );
}

ButtonMessage.propTypes = {
  text: PropTypes.string.isRequired,
};

ButtonList.propTypes = {
  value: PropTypes.shape({
    choices: PropTypes.array.isRequired,
  }).isRequired,
};
