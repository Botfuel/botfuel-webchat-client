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
    payload {
      ... on Text {
        textValue: value
      }
      ... on Table {
        tableValue: value {
          schema {
            key
            label
          }
          rows
        }
      }
      ... on Actions {
        actionValue: value {
          ... on TextAction {
            type
            text
            textActionValue: value
          }
          ... on PostbackAction {
            type
            text
            postbackActionValue: value
          }
        }
      }
      ... on Postback {
        postbackValue: value
        text
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

const TEXT_MESSAGE_MUTATION = gql`
  mutation createTextMessage(
    $user: ID!
    $bot: ID!
    $value: String!
    $sender: String!
  ) {
    createTextMessage(
      user: $user
      bot: $bot
      value: $value
      sender: $sender
    ) {
      ...FullMessage
    }
  }
  ${MessageFragment}
`;

const POSTBACK_MESSAGE_MUTATION = gql`
  mutation createPostbackMessage(
    $user: ID!
    $bot: ID!
    $value: JSON!
    $text: String!
    $sender: String!
  ) {
    createPostbackMessage(
      user: $user
      bot: $bot
      value: $value
      text: $text
      sender: $sender
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
      bot: this.props.botId,
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
      await this.props.createTextMessageMutation({
        variables: {
          user: localStorage.getItem('userId'),
          bot: this.props.botId,
          value: text,
          sender: 'user',
        },
      });
      // If subscriptions are not used, we need to refetch manually the message that was just
      // sent by the user so he gets immediate success feedback on his own message
      if (!this.props.websocketsSupported) {
        this.props.refetch();
      }
    }
  }

  sendAction({ type, value, text }) {
    return async () => {
      const { createTextMessageMutation, createPostbackMessageMutation } = this.props;
      const mutation = type === 'text' ? createTextMessageMutation : createPostbackMessageMutation;

      await mutation({
        variables: {
          user: localStorage.getItem('userId'),
          bot: this.props.botId,
          value,
          sender: 'user',
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

  render() {
    // We need to remove messages that are quick replies
    // and are not the last message
    // We keep intact actions with only links
    const isQuickRepliesAndNotLast = (m, index) =>
      m.type === 'actions' && index !== this.props.messages.length - 1;
    const isLinks = m =>
      m.type === 'actions' && m.payload.actionValue.every(a => a.type === 'link');
    const messages = this.props.messages.filter(
      (m, index) => !isQuickRepliesAndNotLast(m, index) || isLinks(m),
    );

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
  botId: PropTypes.string.isRequired,
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
  websocketsSupported: PropTypes.bool.isRequired,
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
        bot: props.botId,
      };

      // Poll regulary if websockets are not enabled
      if (!props.websocketsSupported) {
        options.pollInterval = 5000;
      }

      return options;
    },
    props: props => ({
      messages: props.data.messages,
      refetch: props.data.refetch,
      subscribeToNewMessages: params =>
        (props.ownProps.websocketsSupported
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
  graphql(TEXT_MESSAGE_MUTATION, { name: 'createTextMessageMutation' }),
  graphql(POSTBACK_MESSAGE_MUTATION, { name: 'createPostbackMessageMutation' }),
)(WebChat);
