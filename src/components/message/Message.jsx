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
import BotAction from './BotAction';
import Table from './Table';
import TextMessage from './TextMessage';
import Actions from './action/Actions';
import Bubble from './Bubble';

const componentsDict = {
  text: TextMessage,
  table: Table,
  actions: Actions,
  postback: TextMessage,
  botAction: BotAction,
};

const ClearDiv = styled.div`
  &::after {
    clear: both;
    content: '';
    display: block;
  }
`;

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

export default class MessageContainer extends React.Component {
  shouldComponentUpdate() {
    return this.props.type === 'actions';
  }

  render() {
    const { side, type, sender, ...props } = this.props;
    const Component = componentsDict[type];
    const disableBubble = ['actions', 'botAction'].includes(type);

    return disableBubble ? (
      <Component type={type} {...props} />
    ) : (
      <ClearDiv component={Component}>
        {side === 'left' && <Avatar sender={sender} />}
        <Bubble side={side}>
          <Component {...props} />
        </Bubble>
      </ClearDiv>
    );
  }
}

MessageContainer.propTypes = {
  side: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  sender: PropTypes.string.isRequired,
  payload: PropTypes.shape({
    textValue: PropTypes.string,
    tableValue: PropTypes.shape({
      schema: PropTypes.array,
      rows: PropTypes.array,
    }),
    actionValue: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        text: PropTypes.string,
        clicked: PropTypes.bool,
        linkActionValue: PropTypes.string,
        postbackActionValue: PropTypes.object,
      }),
    ),
    postbackValue: PropTypes.object,
    quickrepliesValue: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
