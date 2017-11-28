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
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primaryText};
  border: 0;
  margin: 5px;
  padding: 10px;
  border-radius: 7px;
  cursor: pointer;
  display: block;
  width: 100%;

  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }

  &:focus {
    outline: none;
  }
`;

export default function ButtonMessage({ text }) {
  return <Button>{text}</Button>;
}

ButtonMessage.propTypes = {
  text: PropTypes.string.isRequired,
};
