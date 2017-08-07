import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Button = styled.div`
  opacity: ${props => (props.isVisible ? 100 : 0)};
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  border-radius: ${props => props.size}px;
  transition: opacity .5s ease-in-out;
  background-color: #fbfbfb;
  padding: 11px;
  display: ${props => (props.isVisible ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .15);
  cursor: pointer;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  height: 90%;
  width: 90%;
  transition: transform .8s cubic-bezier(.68, -.55, .27, 1.55);
  &:hover {
    transform: rotate(-360deg);
  }
}

`;

export default function StartButton(props) {
  return (
    <Button size={props.size} isVisible={props.isVisible} onClick={props.switchMode}>
      <Logo src="icon.png" />
    </Button>
  );
}

StartButton.propTypes = {
  size: PropTypes.number.isRequired,
  isVisible: PropTypes.bool.isRequired,
  switchMode: PropTypes.func.isRequired,
};
