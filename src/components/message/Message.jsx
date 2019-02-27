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
import Table from './Table';
import TextMessage from './TextMessage';
import Actions from './action/Actions';
import Bubble from './Bubble';
import Image from './Image';
import Cards from './cards/Cards';

const componentsDict = {
  text: TextMessage,
  table: Table,
  actions: Actions,
  postback: TextMessage,
  image: Image,
  cards: Cards,
};

const ClearDiv = styled.div`
  padding: 0 10px;
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
  shouldComponentUpdate(nextProps) {
    return this.props.type === 'actions' && this.props.payload.actionValue !== nextProps.payload.actionValue;
  }

  render() {
    const { side, type, sender, className, ...props } = this.props;
    const Component = componentsDict[type];
    const disableBubble = ['actions', 'cards'].includes(type);
    return disableBubble ? (
      <Component type={type} size={props.width} {...props} />
    ) : (
      <ClearDiv className={`bf-message-container bf-${sender} ${className}`} component={Component}>
        {side === 'left' && <Avatar className="bf-user-avatar" sender={sender} />}
        <Bubble className={`bf-${type}-message`} side={side} isImage={type === 'image'}>
          <Component {...this.props} />
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
  className: PropTypes.string,
};

MessageContainer.defaultProps = {
  className: '',
};
