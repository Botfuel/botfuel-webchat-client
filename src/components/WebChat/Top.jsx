import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Icon = styled.span`
  @font-face {
    font-family: 'font-awesome';
    src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff')
      format('woff');
    font-weight: normal;
    font-style: normal;
  }
  font-family: "font-awesome";
  cursor: pointer;
  &::before {
    position: absolute;
    color: #ddd;
    font-size: 16px;
  }
`;

const Cross = Icon.extend`
  &::before {
    right: 15px;
    top: 10px;
    content: "\f00d";
  }
`;

const FullScreen = Icon.extend`
  &::before {
    left: 15px;
    top: 10px;
    content: ${props => (props.fullScreen ? '"\f066"' : '"\f065"')};
  }
`;

const TopMenu = styled.div`
  font-weight: 200;
  color: ${props => props.theme.colors.mainText};
  background-color: ${props => props.theme.colors.main};
  height: 40px;
  width: 100%;
  padding: 12px 0;
  text-align: center;
  font-size: 16px;
`;

export default function Top(props) {
  return (
    <TopMenu>
      <FullScreen fullScreen={props.fullScreen} onClick={props.switchSize} />
      <Cross onClick={props.switchMode} />
      Comment puis-je vous aider ?
    </TopMenu>
  );
}

Top.propTypes = {
  switchMode: PropTypes.func.isRequired,
  switchSize: PropTypes.func.isRequired,
  fullScreen: PropTypes.bool.isRequired,
};
