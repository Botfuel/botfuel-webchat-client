import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from './Button';

const Container = styled.div`padding-right: 10px;`;

export default function ButtonList({ value }) {
  const choices = value.choices;
  return (
    <Container>
      {choices && choices.map(choice => <Button key={choice.id} text={choice.text} />)}
    </Container>
  );
}

ButtonList.propTypes = {
  value: PropTypes.shape({
    choices: PropTypes.array.isRequired,
  }).isRequired,
};
