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
import { graphql, compose } from 'react-apollo';
import uuidv4 from 'uuid/v4';
import {
  MESSAGES_QUERY_SKIP,
  MESSAGES_QUERY,
  MESSAGES_SUBSCRIPTION,
  TEXT_MESSAGE_MUTATION,
  POSTBACK_MESSAGE_MUTATION,
  MARK_ACTION_AS_CLICKED_MUTATION,
} from '../../utils/graphql';
import Main from './Main';

class WebChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      transcript: '',
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.sendAction = this.sendAction.bind(this);
    this.markAsClicked = this.markAsClicked.bind(this);
    this.setTranscript = this.setTranscript.bind(this);
  }

  componentWillMount() {
    this.props.subscribeToNewMessages({
      user: localStorage.getItem('BOTFUEL_WEBCHAT_USER_ID'),
      bot: this.props.botId,
    });
  }

  componentWillReceiveProps(nextProps) {
    // handle graphql errors
    if (nextProps.error && nextProps.error.graphQLErrors) {
      /* eslint-disable no-console */
      console.log('Error while fetching messages. Assuming message format has changed.');
      /* eslint-enable no-console */
      localStorage.setItem('BOTFUEL_WEBCHAT_USER_ID', uuidv4());
    }
  }

  setIsRecording = (isRecording) => {
    this.setState({ isRecording });
  };

  async setTranscript(transcript) {
    if (transcript) {
      await this.sendMessage(transcript);
      this.setState({
        transcript: '',
      });
      this.setIsRecording(false);
      this.setIsRecording(true);
    }
  }

  async sendMessage(input) {
    // New text message variables
    const variables = {
      user: localStorage.getItem('BOTFUEL_WEBCHAT_USER_ID'),
      bot: this.props.botId,
      value: input,
      sender: 'user',
      referrer: window.location.href || null,
    };
    // Add remote message with optimistic response
    await this.props.createTextMessageMutation({ variables });
    // If subscriptions are not used, we need to refetch manually the message that was just
    // sent by the user so he gets immediate success feedback on his own message
    if (!this.props.websocketsSupported) {
      this.props.refetch();
    }
  }

  sendAction({ type, value, text }) {
    return async () => {
      const { createPostbackMessageMutation, createTextMessageMutation } = this.props;
      const mutation = type === 'text' ? createTextMessageMutation : createPostbackMessageMutation;

      await mutation({
        variables: {
          user: localStorage.getItem('BOTFUEL_WEBCHAT_USER_ID'),
          bot: this.props.botId,
          value,
          sender: 'user',
          referrer: window.location.href || null,
          ...(!!text && {
            text,
          }),
        },
      });

      // If subscriptions are not used, we need to refetch manually the message that was just
      // sent by the user so he gets immediate success feedback on his own message
      if (!this.props.websocketsSupported) {
        this.props.refetch();
      }
    };
  }

  markAsClicked(message) {
    return async (actionIndex) => {
      await this.props.markAsClicked({
        message,
        actionIndex,
      });

      this.props.refetch();
    };
  }

  render() {
    return (
      <Main
        {...this.props}
        {...this.state}
        sendAction={this.sendAction}
        markAsClicked={this.markAsClicked}
        sendMessage={this.sendMessage}
        setTranscript={this.setTranscript}
        setIsRecording={this.setIsRecording}
      />
    );
  }
}

WebChat.propTypes = {
  botId: PropTypes.string.isRequired,
  error: PropTypes.shape({
    graphQLErrors: PropTypes.string,
  }),
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      user: PropTypes.string,
      bot: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      sender: PropTypes.string,
      type: PropTypes.string,
    }),
  ),
  subscribeToNewMessages: PropTypes.func.isRequired,
  createTextMessageMutation: PropTypes.func.isRequired,
  createPostbackMessageMutation: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  markAsClicked: PropTypes.func.isRequired,
  websocketsSupported: PropTypes.bool.isRequired,
  hooks: PropTypes.shape({}),
};

WebChat.defaultProps = {
  messages: [],
  error: {},
  hooks: {},
};

export default compose(
  graphql(MESSAGES_QUERY_SKIP, {
    options: (props) => {
      const options = {};

      options.variables = {
        user: localStorage.getItem('BOTFUEL_WEBCHAT_USER_ID'),
        bot: props.botId,
        skip: !props.isVisible,
      };

      // Poll every 5 seconds if WebSockets are not enabled
      if (!props.websocketsSupported) {
        options.pollInterval = 5000;
      }

      return options;
    },
    props: props => ({
      error: props.data.error,
      messages: props.data.messages,
      refetch: props.data.refetch,
      subscribeToNewMessages: params => (props.ownProps.websocketsSupported
        ? props.data.subscribeToMore({
          document: MESSAGES_SUBSCRIPTION,
          variables: params,
          updateQuery: (store, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return store;
            }
            const newMessage = subscriptionData.data.messageAdded;

            // If the new message is not valid then return previous messages list
            if (!newMessage) {
              return store;
            }

            // Handle hook message
            if (newMessage.type === 'hook') {
              const { ownProps } = props;
              const { hookValue } = newMessage.payload;
              // verify if hook name is defined in hooks param
              if (Object.prototype.hasOwnProperty.call(ownProps.hooks, hookValue.name)) {
                // if yes then call the function with the optional parameters
                ownProps.hooks[hookValue.name](hookValue.args);
              }
              // finally return the previous messages list
              return store;
            }

            // console.log('New message added to store', newMessage);
            // Return updated store
            return {
              messages: [...store.messages, newMessage],
            };
          },
        })
        : null),
    }),
  }),
  graphql(TEXT_MESSAGE_MUTATION, { name: 'createTextMessageMutation' }),
  graphql(POSTBACK_MESSAGE_MUTATION, { name: 'createPostbackMessageMutation' }),
  graphql(MARK_ACTION_AS_CLICKED_MUTATION, {
    props: ({ ownProps, mutate }) => ({
      markAsClicked({ message, actionIndex }) {
        // Create a fictive message that is the same message
        // with the clicked action that is set to clicked: true
        const newMessage = {
          ...message,
          payload: {
            ...message.payload,
            actionValue: Object.assign([], message.payload.actionValue, {
              [actionIndex]: {
                ...message.payload.actionValue[actionIndex],
                clicked: true,
              },
            }),
          },
        };

        // Set the fictive message as the mutation optimistic result
        return mutate({
          variables: { message: message.id, actionIndex },
          optimisticResponse: {
            __typename: 'Mutation',
            markActionAsClicked: {
              __typename: 'Message',
              ...newMessage,
            },
          },
          update: (store, { data: { markActionAsClicked } }) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: MESSAGES_QUERY,
              variables: {
                user: localStorage.getItem('BOTFUEL_WEBCHAT_USER_ID'),
                bot: ownProps.botId,
              },
            });

            // Replace old message with clicked message in messages array
            const messageIndex = data.messages.findIndex(m => m.id === message.id);
            data.messages[messageIndex] = markActionAsClicked;

            // Write our data back to the cache.
            store.writeQuery({ query: MESSAGES_QUERY, data });
          },
        });
      },
    }),
  }),
)(WebChat);
