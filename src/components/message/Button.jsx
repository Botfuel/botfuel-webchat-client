import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props => (props.side === 'left' ? '#f1f0f0' : '#0084f4')};
`;

export default ({ text }) =>
  (<Button>
    {text}
  </Button>);
