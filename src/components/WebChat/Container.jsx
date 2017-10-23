import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import { graphql, gql } from 'react-apollo';
import StartButton from 'components/StartButton';
import WebChat from 'components/WebChat';

const BOT_QUERY = gql`
  query bot($botId: ID!) {
    bot(id: $botId) {
      allowedOrigins
    }
  }
`;

const MainContainer = styled.div`${props => props.theme.fluid && 'height:100%;'};`;

const StyledContainer = styled.div`
  ${props => props.theme.fluid && 'height:100%;'};
  text-align: left;
  position: ${props => (props.theme.fixed ? 'fixed' : 'static')};
  bottom: 20px;
  right: 20px;
  ${props => props.noEvents && 'pointer-events: none'};
  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  * {
    box-sizing: border-box;
  }
  @media (max-height: ${props => props.height + 20}px),
    (max-width: ${props => props.width + 20}px),
    ${props => props.fullScreen && 'all'} {
    bottom: 0;
    right: 0;
  }
`;

const Container = ({
  theme,
  width,
  height,
  botId,
  startButtonSize,
  fullScreen,
  chatStarted,
  switchState,
  websocketsSupported,
  toggleFullScreen,
  extraAllowedOrigins,
  disableFullScreenButton,
  menuActions,
  thinkingIndicatorDelay,
  debug,
  data: { bot = {}, loading },
}) => {
  if (loading) {
    return null;
  }

  if (!bot && !loading) {
    /* eslint-disable no-console */
    console.log('Bot not found.');
    /* eslint-enable no-console */
    return null;
  }

  const { allowedOrigins = [] } = bot;
  const cleanUrls = extraAllowedOrigins.concat(allowedOrigins).map(url => url.replace(/\/+$/, ''));

  if (!window.location.origin) {
    // Some browsers (mainly IE < 11) does not have this property, so we need to build it manually
    window.location.origin = `${window.location.protocol}//${window.location.hostname}${window
      .location.port
      ? `:${window.location.port}`
      : ''}`;
  }

  if (!cleanUrls.includes('*') && !cleanUrls.includes(window.location.origin) && !loading) {
    /* eslint-disable no-console */
    console.log(
      'Your website is not allowed to use this webchat. Please check that this website’s url is among the allowed origins of the bot on https://app.botfuel.io.',
    );
    /* eslint-enable no-console */
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <MainContainer>
        <StyledContainer fullScreen={fullScreen} width={width} height={height}>
          <WebChat
            botId={botId}
            fullScreen={fullScreen}
            width={width}
            height={height}
            isVisible={chatStarted}
            switchMode={switchState}
            toggleFullScreen={toggleFullScreen}
            websocketsSupported={websocketsSupported}
            disableFullScreenButton={disableFullScreenButton}
            menuActions={menuActions}
            thinkingIndicatorDelay={thinkingIndicatorDelay}
            debug={debug}
            theme={theme}
          />
        </StyledContainer>
        {theme.fixed && (
          <StyledContainer noEvents={chatStarted}>
            <StartButton
              fullScreen={fullScreen}
              isVisible={!chatStarted}
              size={startButtonSize}
              switchMode={switchState}
            />
          </StyledContainer>
        )}
      </MainContainer>
    </ThemeProvider>
  );
};

Container.propTypes = {
  botId: PropTypes.string.isRequired,
  startButtonSize: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object,
    fixed: PropTypes.bool,
    layout: PropTypes.shape({
      compact: PropTypes.bool,
      rounded: PropTypes.bool,
      shadowed: PropTypes.bool,
    }),
  }).isRequired,
  fullScreen: PropTypes.bool,
  chatStarted: PropTypes.bool,
  switchState: PropTypes.func.isRequired,
  websocketsSupported: PropTypes.bool,
  toggleFullScreen: PropTypes.func.isRequired,
  extraAllowedOrigins: PropTypes.arrayOf(PropTypes.string),
  disableFullScreenButton: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    bot: PropTypes.object,
    loading: PropTypes.bool,
  }).isRequired,
  menuActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      message: PropTypes.shape({
        type: PropTypes.string,
        payload: PropTypes.shape({}),
      }),
    }),
  ).isRequired,
  thinkingIndicatorDelay: PropTypes.number.isRequired,
  debug: PropTypes.bool.isRequired,
};

Container.defaultProps = {
  fullScreen: false,
  chatStarted: false,
  websocketsSupported: false,
  extraAllowedOrigins: [],
};

export default graphql(BOT_QUERY)(Container);
