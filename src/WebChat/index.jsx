import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { gql, graphql, compose } from 'react-apollo';
import MessageListContainer from '../components/message/MessageListContainer';
import Top from './Top';
import Bottom from './Bottom';

const Container = styled.div`
  transition: opacity 0.5s ease-in-out;
  display: ${props => (props.isVisible ? 'block' : 'none')};
  color: #000;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  box-shadow: 0 0 24px rgba(0, 0, 0, .15);
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  overflow: hidden;
  @media (max-height: ${props => props.height + 20}px),
    (max-width: ${props => props.width + 20}px),
    ${props => props.fullScreen && 'all'} {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    border: 0;
  }
`;

const MESSAGES_QUERY = gql`
  query messages($user: ID!, $bot: ID!) {
    messages(user: $user, bot: $bot) {
      id
      user
      bot
      type
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
          }
        }
      }
      sender
    }
  }
`;

const MESSAGES_SUBSCRIPTION = gql`
  subscription onMessageAdded($user: ID!, $bot: ID!) {
    messageAdded(user: $user, bot: $bot) {
      id
      user
      bot
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
          }
        }
      }
      sender
      type
    }
  }
`;

const MESSAGE_MUTATION = gql`
  mutation createMessage($user: ID!, $bot: ID!, $value: String!, $sender: String!, $type: String!) {
    createMessage(user: $user, bot: $bot, value: $value, sender: $sender, type: $type) {
      id
      user
      bot
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
          }
        }
      }
      sender
      type
    }
  }
`;

class WebChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          id: '1',
          user: '1',
          bot: '1',
          type: 'block',
          value: {
            top: true,
            title: 'La Poste',
            text: 'Assistant Courier. Commandes : table, text, choices.',
          },
          sender: 'bot',
        },
        {
          id: '2',
          user: '1',
          bot: '1',
          type: 'text',
          value: 'Bonjour !',
          sender: 'bot',
        },
      ],
      input: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetInput = this.resetInput.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillMount() {
    this.props.subscribeToNewMessages({
      user: localStorage.getItem('userId'),
      bot: '1234',
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
          bot: '1234',
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

  render() {
    return (
      <Container
        width={this.state.width || this.props.width}
        height={this.state.height || this.props.height}
        isVisible={this.props.isVisible}
        fullScreen={this.props.fullScreen}
      >
        <Top
          fullScreen={this.props.fullScreen}
          switchMode={this.props.switchMode}
          switchSize={this.props.toggleFullScreen}
        />
        <MessageListContainer messages={this.props.messages || []} />
        <Bottom
          sendMessage={this.sendMessage}
          onKeyPress={this.handleKeyPress}
          onInputChange={this.handleInputChange}
          input={this.state.input}
        />
      </Container>
    );
  }
}

WebChat.propTypes = {
  switchMode: PropTypes.func.isRequired,
  toggleFullScreen: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fullScreen: PropTypes.bool.isRequired,
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
    options: () => {
      const options = {};

      options.variables = {
        user: localStorage.getItem('userId'),
        bot: '1234',
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
