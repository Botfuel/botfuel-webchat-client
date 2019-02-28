/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darken } from 'polished';

const TextButton = ({ handleClick, label, disabled, clicked }) => (
  <Button
    className="bf-action-button"
    onClick={disabled || clicked ? () => null : handleClick}
    disabled={disabled}
    clicked={clicked}
  >
    {label}
  </Button>
);

TextButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  clicked: PropTypes.bool,
};

TextButton.defaultProps = {
  disabled: false,
  clicked: false,
};

function getStatusBackgroundColor(props) {
  if (props.disabled) {
    return 'transparent';
  }

  if (props.clicked) {
    return props.theme.colors.primary;
  }

  return props.theme.colors.secondary;
}

function getStatusColor(props) {
  if (props.disabled) {
    return 'lightgrey';
  }

  if (props.clicked) {
    return props.theme.colors.primaryText;
  }

  return props.theme.colors.primary;
}

const Button = styled.div`
  font-size: 14px;
  overflow: hidden;
  margin-bottom: 10px;
  float: ${props => props.side};
  display: inline-block;
  padding: 8px 10px;
  border-radius: 14px;
  position: relative;
  max-width: calc(100% - 75px);
  text-align: center;
  background-color: ${props => getStatusBackgroundColor(props)};
  color: ${props => getStatusColor(props)};
  border: 1px solid ${props => (props.disabled ? 'lightgrey' : props.theme.colors.primary)};
  cursor: ${props => (props.disabled || props.clicked ? 'default' : 'pointer')};
  box-shadow: ${props =>
    (props.theme.layout.shadowed && !props.disabled && !props.clicked
      ? `3px 3px 5px 0px ${darken(0.1, props.theme.colors.background)}`
      : null)};
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 400ms ease;

  &:hover {
    ${props =>
    !props.disabled &&
      !props.clicked &&
      `background-color: ${darken(0.03, props.theme.colors.secondary)}`};
  }

  &:focus {
    outline: none;
  }
`;

export default TextButton;
