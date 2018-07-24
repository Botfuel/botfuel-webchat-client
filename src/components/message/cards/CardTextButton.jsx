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

const getStatusBackgroundColor = (props) => {
  if (props.disabled) {
    return 'transparent';
  }

  if (props.clicked) {
    return props.theme.colors.primary;
  }

  return 'transparent';
};

const getStatusColor = (props) => {
  if (props.disabled) {
    return 'lightgrey';
  }

  if (props.clicked) {
    return props.theme.colors.primaryText;
  }

  return props.theme.colors.primary;
};

const Button = styled.div`
  font-size: 15px;
  padding: 10px;
  text-align: center;
  background-color: ${props => getStatusBackgroundColor(props)};
  color: ${props => getStatusColor(props)};
  cursor: ${props => (props.disabled || props.clicked ? 'default' : 'pointer')};
  transition: all 400ms ease; 

  &:hover {
    ${props => !props.disabled && !props.clicked && `background-color: ${darken(0.03, props.theme.colors.secondary)}`};
  }
  &:focus {
    outline: none;
  }
`;

const CardTextButton = ({ handleClick, label, disabled, clicked }) => (
  <Button
    onClick={disabled || clicked ? () => null : handleClick}
    disabled={disabled}
    clicked={clicked}
  >
    {label}
  </Button>
);

CardTextButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  clicked: PropTypes.bool,
};

CardTextButton.defaultProps = {
  disabled: false,
  clicked: false,
};

export default CardTextButton;
