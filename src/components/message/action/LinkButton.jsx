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

const LinkButton = ({ label, link, handleClick, disabled, clicked }) => (
  <Link className="bf-action-link" href={link} onClick={handleClick} target="_blank" disabled={disabled} clicked={clicked}>
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

export default LinkButton;

const Link = styled.a`
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
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 400ms ease;
  text-decoration: none;

  &:hover {
    ${props =>
    !props.disabled &&
    !props.clicked &&
    `background-color: ${darken(0.03, props.theme.colors.secondary)}`};
  }

  &:focus {
    outline: none;
  }
  ${props => (props.clicked || props.disabled ? 'pointer-events: none' : '')};
`;
