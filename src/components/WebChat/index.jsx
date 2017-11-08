import React from 'react';
import PropTypes from 'prop-types';
import { gql, graphql, compose } from 'react-apollo';
import last from 'lodash/last';
import uuidv4 from 'uuid/v4';
import Main from './Main';

const MessageFragment = gql`
  fragment FullMessage on Message {
    id
    type
    user
    bot
    sender
    createdAt
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
          ... on LinkAction {
            type
            text
            clicked
            linkActionValue: value
          }
          ... on PostbackAction {
            type
            text
            clicked
            postbackActionValue: value
          }
        }
      }
      ... on Postback {
        postbackValue: value
        text
      }
      ... on Quickreplies {
        quickrepliesValue: value
      }
      ... on BotAction {
        botActionValue: value {
          action
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

const MARK_ACTION_AS_CLICKED_MUTATION = gql`
  mutation markActionAsClicked($message: ID!, $actionIndex: Int!) {
    markActionAsClicked(message: $message, actionIndex: $actionIndex) {
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
      isRecording: false,
      transcript: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetInput = this.resetInput.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
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

  handleInputChange(e) {
    if (!e.target.value || (e.target.value && e.target.value.length < 500)) {
      this.setState({
        input: e.target.value,
      });
    }
  }

  handleKeyPress(e) {
    // keyCode 13 is the ENTER key
    if (e && e.nativeEvent.keyCode === 13) {
      this.sendMessage();
      e.preventDefault();
    }
  }

  resetInput() {
    this.setState({
      input: undefined,
    });
  }

  async sendMessage(input) {
    const text = input || this.state.input;
    if (text) {
      this.resetInput();
      await this.props.createTextMessageMutation({
        variables: {
          user: localStorage.getItem('BOTFUEL_WEBCHAT_USER_ID'),
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
      const { createPostbackMessageMutation, createTextMessageMutation } = this.props;
      const mutation = type === 'text' ? createTextMessageMutation : createPostbackMessageMutation;

      await mutation({
        variables: {
          user: localStorage.getItem('BOTFUEL_WEBCHAT_USER_ID'),
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
    // Quickreplies are only displayed if they are the last message
    const lastMessage = last(this.props.messages);
    const quickreplies =
      (!!lastMessage &&
        lastMessage.type === 'quickreplies' &&
        lastMessage.payload.quickrepliesValue) ||
      [];

    return (
      <Main
        {...this.props}
        {...this.state}
        messages={this.props.messages}
        quickreplies={quickreplies}
        sendAction={this.sendAction}
        markAsClicked={this.markAsClicked}
        sendMessage={this.sendMessage}
        handleKeyPress={this.handleKeyPress}
        handleInputChange={this.handleInputChange}
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
  websocketsSupported: PropTypes.bool.isRequired,
};

WebChat.defaultProps = {
  messages: [],
  error: {},
};

export default compose(
  graphql(MESSAGES_QUERY, {
    options: (props) => {
      const options = {};

      options.variables = {
        user: localStorage.getItem('BOTFUEL_WEBCHAT_USER_ID'),
        bot: props.botId,
      };

      // Poll regulary if websockets are not enabled
      if (!props.websocketsSupported) {
        options.pollInterval = 5000;
      }

      return options;
    },
    props: props => ({
      error: props.data.error,
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
