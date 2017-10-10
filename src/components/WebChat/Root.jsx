import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import websocketsCheck from 'utils/websockets-check';
import ContainerWithData from 'components/WebChat/Container';
import createApolloClient from '../../apollo-client';

export default class Root extends React.Component {
  static propTypes = {
    initialState: PropTypes.shape({
      startOpen: PropTypes.bool,
      startFullScreen: PropTypes.bool,
    }).isRequired,
    customLabels: PropTypes.shape({}),
    serverUrl: PropTypes.string,
  };

  static defaultProps = {
    customLabels: {},
    serverUrl: undefined,
  };

  static childContextTypes = {
    customLabels: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = props.initialState;
    this.switchState = this.switchState.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
  }

  getChildContext() {
    return {
      customLabels: this.props.customLabels,
    };
  }

  componentWillMount() {
    const setWebsocket = (websocket) => {
      // Store whether websockets are supported
      this.client = createApolloClient(websocket, this.props.serverUrl);
      this.setState({
        websocketsSupported: websocket,
      });
    };

    websocketsCheck(setWebsocket);
  }

  switchState() {
    this.setState(oldState => ({ chatStarted: !oldState.chatStarted }));
  }

  toggleFullScreen() {
    this.setState(oldState => ({ fullScreen: !oldState.fullScreen }));
  }

  render() {
    // While we check for websockets support
    if (this.state.websocketsSupported === null || !this.client) {
      return null;
    }

    return (
      <ApolloProvider client={this.client}>
        <ContainerWithData
          {...this.state}
          {...this.props}
          switchState={this.switchState}
          toggleFullScreen={this.toggleFullScreen}
        />
      </ApolloProvider>
    );
  }
}
