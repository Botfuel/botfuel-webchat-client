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

const getStatusColor = (props) => {
  if (props.disabled) {
    return 'lightgrey';
  }

  if (props.clicked) {
    return '#609';
  }

  return props.theme.colors.primary;
};

const Link = styled.a`
  font-size: 15px;
  font-weight: 300;
  overflow: hidden;
  float: ${props => props.side};
  display: inline-block;
  padding: 10px;
  position: relative;
  color: ${props => getStatusColor(props)};
  text-align: center;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 400ms ease;

  &:hover {
    ${props => !props.disabled && !props.clicked && `background-color: ${darken(0.03, props.theme.colors.secondary)}`};
  }
  &:focus {
    outline: none;
  }
  ${props => (props.clicked || props.disabled ? 'pointer-events: none' : '')};
`;

const CardLinkButton = ({ label, link, handleClick, disabled, clicked }) => (
  <Link href={link} onClick={handleClick} target="_blank" disabled={disabled} clicked={clicked}>
    {label}
  </Link>
);

CardLinkButton.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  clicked: PropTypes.bool.isRequired,
};

export default CardLinkButton;
