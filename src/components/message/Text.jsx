import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Message = styled.div`
  clear: both;
  overflow: hidden;
  margin-bottom: 10px;
  transition: all .5s linear;
  float: ${props => props.side};
  color: ${props => (props.side === 'left' ? '#000' : '#fff')};
  > div {
    background-color: ${props => (props.side === 'left' ? '#f1f0f0' : '#0084f4')};
  }
`;

const Text = styled.div`
  font-size: 15px;
  font-weight: 300;
`;

const TextWrapper = styled.div`
  display: inline-block;
  padding: 8px 10px;
  border-radius: 14px;
  position: relative;
`;

export default function TextMessage(props) {
  return (
    <Message side="right">
      <TextWrapper>
        <Text>
          {props.value}
        </Text>
      </TextWrapper>
    </Message>
  );
}

TextMessage.propTypes = {
  value: PropTypes.func.isRequired,
};
