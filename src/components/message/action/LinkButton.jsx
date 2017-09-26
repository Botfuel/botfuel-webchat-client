import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const LinkButton = ({ label, link, handleClick, disabled, clicked }) => (
  <Link href={link} onClick={handleClick} target="_blank" disabled={disabled} clicked={clicked}>
    {label}
  </Link>
);

LinkButton.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  clicked: PropTypes.bool.isRequired,
};

function getStatusColor(props) {
  if (props.disabled) {
    return 'lightgrey';
  }

  if (props.clicked) {
    return '#609';
  }

  return props.theme.colors.primary;
}

export default LinkButton;

const Link = styled.a`
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
  color: ${props => getStatusColor(props)};
  text-align: center;
  background-color: transparent;
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
  ${props => (props.clicked || props.disabled ? 'pointer-events: none' : '')};
`;
