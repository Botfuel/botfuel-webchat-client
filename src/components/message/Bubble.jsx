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

import styled from 'styled-components';
import { darken } from 'polished';

export default styled.div`
  font-size: 15px;
  font-weight: 300;
  overflow: hidden;
  margin-bottom: ${props => (props.theme.layout.compact ? '10px' : '25px')};
  float: ${props => props.side};
  display: inline-block;
  padding: ${props => (props.theme.layout.compact ? '8px 10px' : '10px 25px')};
  border-radius: ${props => (props.theme.layout.rounded ? '20px' : '15px')};
  box-shadow: ${props =>
    (props.theme.layout.shadowed
      ? `0px 5px 25px 2px ${darken(0.1, props.theme.colors.background)}`
      : null)};
  position: relative;
  max-width: calc(100% - 75px);
  color: ${props =>
    (props.side === 'left' ? props.theme.colors.secondaryText : props.theme.colors.primaryText)};
  background-color: ${props =>
    (props.side === 'left' ? props.theme.colors.secondary : props.theme.colors.primary)};
`;
