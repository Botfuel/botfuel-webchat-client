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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const ButtonStyles = {
  bubble: css`
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    background-color: #fbfbfb;
  `,
};

const Button = styled.div`
  pointer-events: all;
  opacity: ${props => (props.isVisible ? 1 : 0)};
  visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  border-radius: 100%;
  transition: visibility .3s ease-in-out;
  cursor: pointer;
  background-image: url("${props => props.theme.images.startButton}");
  background-position: center;
  background-size: 50%;
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
