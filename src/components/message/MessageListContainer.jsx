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
import MessageList from './MessageList';

export default class MessageListContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      justClicked: 0,
    };
  }

  /**
  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = (
      this.props.messages.length !== nextProps.messages.length
      || this.state.justClicked !== nextState.justClicked
    );
  }
   */

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    const { scrollHeight, clientHeight } = this.innerRef;
    const maxScrollTop = scrollHeight - clientHeight;
    this.innerRef.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  markAsClicked = messageId => (actionIndex) => {
    this.setState(state => ({ justClicked: state.justClicked + 1 }));
    return this.props.markAsClicked(messageId)(actionIndex);
  };

  render() {
    console.log('MessageListContainer.render');
    return (
      <MessageList
        {...this.props}
        markAsClicked={this.markAsClicked}
        setRef={(ref) => {
          this.innerRef = ref;
        }}
      />
    );
  }
}

MessageListContainer.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  markAsClicked: PropTypes.func.isRequired,
};
