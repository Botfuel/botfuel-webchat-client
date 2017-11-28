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
import ThinkingIndicator from '../ui/ThinkingIndicator';
import Bubble from './Bubble';

const Avatar = styled.div`
  padding: 3px 0px;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 9px;
  float: left;
  background-image: url("${props =>
    (props.sender === 'bot' ? props.theme.images.botAvatar : props.theme.images.userAvatar)}");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

class BotAction extends React.Component {
  constructor() {
    super();

    this.state = {
      hide: false,
    };
  }

  render() {
    const { payload: { botActionValue } } = this.props;

    switch (botActionValue.action) {
      case 'THINKING_ON':
        return (
          <div>
            <Avatar sender="bot" />
            <Bubble side="left">
              <ThinkingIndicator />
            </Bubble>
          </div>
        );
      case 'THINKING_OFF':
        return null;
      default:
        return null;
    }
  }
}

BotAction.propTypes = {
  payload: PropTypes.shape({
    botActionValue: PropTypes.shape({
      action: PropTypes.string,
    }),
  }).isRequired,
};

export default BotAction;
