import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TextButton = ({ handleClick, label }) => <Button onClick={handleClick}>{label}</Button>;

TextButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.func.isRequired,
};

const Button = styled.div`
  font-size: 15px;
  font-weight: 300;
  overflow: hidden;
  margin-bottom: 10px;
  float: ${props => props.side};
  display: inline-block;
  padding: 8px 10px;
  border-radius: 14px;
  position: relative;
  max-width: calc(100% - 75px);
  color: ${props =>
    (props.side === 'left' ? props.theme.colors.secondaryText : props.theme.colors.primaryText)};
  background-color: ${props =>
    (props.side === 'left' ? props.theme.colors.secondary : props.theme.colors.primary)};
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
  return <Button {...props}>{text}</Button>;
}

ButtonMessage.propTypes = {
  text: PropTypes.string.isRequired,
};

export default TextButton;
