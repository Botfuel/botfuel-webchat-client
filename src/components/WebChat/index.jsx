import React from 'react';
import PropTypes from 'prop-types';
import { gql, graphql, compose } from 'react-apollo';
import Main from './Main';

const MessageFragment = gql`
  fragment FullMessage on Message {
    id
    type
    user
    bot
    sender
    value {
      ... on Text {
        text
      }
      ... on Table {
        schema {
          key
          label
        }
        rows
      }
      ... on Choices {
        choices {
          id
          text
          payload
        }
      }
    }
  }
`;

const MESSAGES_QUERY = gql`
  query messages($user: ID!, $bot: ID!) {
    messages(user: $user, bot: $bot) {
      ...FullMessage
    }
  }
  ${MessageFragment}
`;

const MESSAGES_SUBSCRIPTION = gql`
  subscription onMessageAdded($user: ID!, $bot: ID!) {
    messageAdded(user: $user, bot: $bot) {
      ...FullMessage
    }
  }
  ${MessageFragment}
`;

const MESSAGE_MUTATION = gql`
  mutation createMessage(
    $user: ID!
    $bot: ID!
    $value: String
    $action: ActionInput
    $sender: String!
    $type: String!
  ) {
    createMessage(
      user: $user
      bot: $bot
      value: $value
      action: $action
      sender: $sender
      type: $type
    ) {
      ...FullMessage
    }
  }
  ${MessageFragment}
`;

class WebChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetInput = this.resetInput.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.sendAction = this.sendAction.bind(this);
  }

  componentWillMount() {
    this.props.subscribeToNewMessages({
      user: localStorage.getItem('userId'),
      bot: this.props.appId,
    });
  }

  handleInputChange(e) {
    this.setState({
      input: e.target.value,
    });
  }

  resetInput() {
    this.setState({
      input: '',
    });
  }

  handleKeyPress(e) {
    if (e && e.nativeEvent.keyCode === 13) {
      this.sendMessage(this.state.input);
    }
  }

  async sendMessage() {
    const text = this.state.input;
    if (text) {
      this.resetInput();
      await this.props.createMessageMutation({
        variables: {
          user: localStorage.getItem('userId'),
          bot: this.props.appId,
          value: text,
          type: 'text',
          sender: 'user',
        },
      });

      // If subscriptions are not used, we need to refetch manually the message that was just
      // sent by the user so he gets immediate success feedback on his own message
      if (!window.WebSocket) {
        this.props.refetch();
      }
    }
  }

  sendAction({ payload, text, id }) {
    return async () => {
      await this.props.createMessageMutation({
        variables: {
          user: localStorage.getItem('userId'),
          bot: this.props.appId,
          action: {
            payload,
            text,
            id,
          },
          type: 'action',
          sender: 'user',
        },
      });

      // If subscriptions are not used, we need to refetch manually the message that was just
      // sent by the user so he gets immediate success feedback on his own message
      if (!window.WebSocket) {
        this.props.refetch();
      }
    };
  }

  render() {
    // We need to remove messages that are quick replies
    // and are not the last message
    const isQuickRepliesAndNotLast = (m, index) =>
      m.type === 'choices' && index !== this.props.messages.length - 1;
    const messages = this.props.messages.filter((m, index) => !isQuickRepliesAndNotLast(m, index));

    return (
      <Main
        {...this.props}
        {...this.state}
        messages={messages}
        sendAction={this.sendAction}
        sendMessage={this.sendMessage}
        handleKeyPress={this.handleKeyPress}
        handleInputChange={this.handleInputChange}
      />
    );
  }
}

WebChat.propTypes = {
  appId: PropTypes.string.isRequired,
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
  createMessageMutation: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};

WebChat.defaultProps = {
  messages: [],
};

export default compose(
  graphql(MESSAGES_QUERY, {
    options: (props) => {
      const options = {};

      options.variables = {
        user: localStorage.getItem('userId'),
        bot: props.appId,
      };

      // Poll regulary if websockets are not enabled
      if (!window.WebSocket) {
        options.pollInterval = 5000;
      }

      return options;
    },
    props: props => ({
      messages: props.data.messages,
      refetch: props.data.refetch,
      subscribeToNewMessages: params =>
        (window.WebSocket
          ? props.data.subscribeToMore({
            document: MESSAGES_SUBSCRIPTION,
            variables: params,
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) {
                return prev;
              }
              const newMessage = subscriptionData.data.messageAdded;
              return {
                messages: [...prev.messages, { ...newMessage }],
              };
            },
          })
          : null),
    }),
  }),
  graphql(MESSAGE_MUTATION, { name: 'createMessageMutation' }),
)(WebChat);
