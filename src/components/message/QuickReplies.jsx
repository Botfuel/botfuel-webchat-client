import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Bubble from './Bubble';

const Container = styled.div`
  text-align: right;
  display: flex;
  justify-content: flex-end;
  > div {
    margin-left: ${props => 5 / props.size}%;
    width: ${props => 90 / props.size}%;
    max-width: 200px;
  }
`;
export default function ButtonList({ value, sendAction }) {
  const choices = value.choices;

  return (
    <Container size={value.choices.length}>
      {choices &&
        choices.map(choice =>
          <ButtonMessage onClick={sendAction(choice)} key={choice.id} text={choice.text} />,
        )}
    </Container>
  );
}

const Button = Bubble.extend`
  text-align: center;
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary};
  cursor: pointer;
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: ${props => props.theme.colors.secondaryLight};
  }
  &:focus {
    outline: none;
  }
`;

function ButtonMessage({ text, ...props }) {
  return (
    <Button {...props}>
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
  sendAction: PropTypes.func.isRequired,
};
