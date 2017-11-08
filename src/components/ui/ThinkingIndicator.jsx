import React from 'react';
import styled, { keyframes } from 'styled-components';

const blink = keyframes`
    0% {
      opacity: .2;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: .2;
    }
`;

const Wrapper = styled.div`margin-top: -4px;`;

const Dot = styled.span`
  font-family: 'font-awesome';
  &::before {
    content: '\\f111';
  }
  font-size: 8px;
  padding-left: 2px;
  padding-right: 2px;
  animation-name: ${blink};
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const ThinkingIndicator = () => (
  <Wrapper>
    <Dot />
    <Dot />
    <Dot />
  </Wrapper>
);

export default ThinkingIndicator;
