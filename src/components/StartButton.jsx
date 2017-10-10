import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const ButtonStyles = {
  bubble: css`
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    background-color: #fbfbfb;
    background-size: 75%;
  `,
};

const Button = styled.div`
  opacity: ${props => (props.isVisible ? 1 : 0)};
  visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  border-radius: 100%;
  transition: visibility .3s ease-in-out;
  cursor: pointer;
  background-image: url("${props => props.theme.images.startButton}");
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;

  ${props => ButtonStyles[props.theme.startButtonStyle]};
`;

export default function StartButton(props) {
  return <Button size={props.size} isVisible={props.isVisible} onClick={props.switchMode} />;
}

StartButton.propTypes = {
  size: PropTypes.number.isRequired,
  isVisible: PropTypes.bool.isRequired,
  switchMode: PropTypes.func.isRequired,
};
