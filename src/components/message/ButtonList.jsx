import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from './Button';

const Container = styled.div`padding-right: 10px;`;

export default function ButtonList({ value }) {
  return (
    <Container>
      {value && value.map(choice => <Button key={choice.id} text={choice.text} />)}
    </Container>
  );
}

ButtonList.propTypes = {
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
};
