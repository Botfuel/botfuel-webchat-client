import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TextButton from './action/TextButton';

const Container = styled.div`
  text-align: right;
  display: flex;
  justify-content: flex-end;

  > * {
    margin-left: ${props => 5 / props.size}%;
    width: ${props => 90 / props.size}%;
    max-width: 200px;
  }
`;

function Quickreplies({ quickreplies, sendAction }) {
  return (
    <Container size={quickreplies.length}>
      {quickreplies.map(q => (
        <TextButton handleClick={sendAction({ type: 'text', value: q })} label={q} />
      ))}
    </Container>
  );
}

Quickreplies.propTypes = {
  quickreplies: PropTypes.arrayOf(PropTypes.string).isRequired,
  sendAction: PropTypes.func.isRequired,
};

export default Quickreplies;
