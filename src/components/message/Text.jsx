import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Text = styled.div`
  font-size: 15px;
  font-weight: 300;
`;

const TextWrapper = styled.div`
  display: inline-block;
  padding: 8px 10px;
  border-radius: 14px;
  position: relative;
  color: ${props => (props.side === 'left' ? '#000' : '#fff')};
  background-color: ${props => (props.side === 'left' ? '#f1f0f0' : '#0084f4')};
`;

export default function TextMessage(props) {
  return (
    <TextWrapper side="right">
      <Text>
        {props.value}
      </Text>
    </TextWrapper>
  );
}

TextMessage.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]).isRequired,
};
