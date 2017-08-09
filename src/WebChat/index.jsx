import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
<<<<<<< HEAD
=======
import { gql, graphql, compose } from 'react-apollo';

import Bottom from './Bottom';
import Top from './Top';
>>>>>>> Subscribe to new message using ws
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
    (max-width: ${props => props.width + 20}px) {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    border: 0;
  }
`;

<<<<<<< HEAD
const SERVER_URL = 'https://botfuel-webchat-server.herokuapp.com';

export default class WebChat extends React.Component {
=======
const MESSAGES_QUERY = gql`
  query messages($user: ID!, $bot: ID!) {
    messages(user: $user, bot: $bot) {
      id
      user
      bot
      type
      value
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
      value
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
      value
      sender
      type
    }
  }
`;

class WebChat extends React.Component {
>>>>>>> Subscribe to new message using ws
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
      await this.props.createMessageMutation({
        variables: {
          user: localStorage.getItem('userId'),
          bot: '1234',
          value: text,
          type: 'text',
          sender: 'user',
        },
      });
      this.resetInput();

      // MOCKING
      if (['text', 'table', 'choices'].includes(text)) {
        const response = await fetch(`${SERVER_URL}/${text}`);
        const answer = text === 'text' ? await response.text() : await response.json();

        setTimeout(() => {
          this.setState(oldState => ({
            messages: [...oldState.messages, { type: text, value: answer, sender: 'bot' }],
          }));
        }, 1000);
      }
    }
  }

  render() {
    return (
      <Container
        width={this.props.width}
        height={this.props.height}
        isVisible={this.props.isVisible}
      >
        <Top switchMode={this.props.switchMode} />
        <MessageListContainer messages={this.state.messages} />
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
  isVisible: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      user: PropTypes.string,
      bot: PropTypes.string,
      value: PropTypes.string,
      sender: PropTypes.string,
      type: PropTypes.string,
    }),
  ),
  subscribeToNewMessages: PropTypes.func.isRequired,
  createMessageMutation: PropTypes.func.isRequired,
};

WebChat.defaultProps = {
  messages: [],
};

export default compose(
  graphql(MESSAGES_QUERY, {
    name: 'messages',
    options: () => ({
      variables: {
        user: localStorage.getItem('userId'),
        bot: '1234',
      },
    }),
    props: props => ({
      messages: props.messages.messages,
      subscribeToNewMessages: params =>
        props.messages.subscribeToMore({
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
        }),
    }),
  }),
  graphql(MESSAGE_MUTATION, { name: 'createMessageMutation' }),
)(WebChat);
