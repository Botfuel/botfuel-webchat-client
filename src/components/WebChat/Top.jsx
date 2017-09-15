import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import WithLabels from '../utils/WithLabels';

const Icon = styled.span`
  @font-face {
    font-family: 'font-awesome';
    src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff')
      format('woff');
    font-weight: normal;
    font-style: normal;
  }
  font-family: 'font-awesome';
  cursor: pointer;
  &::before {
    position: absolute;
    color: #ddd;
    font-size: 16px;
  }
`;

const Cross = Icon.extend`
  &::before {
    display: ${props => (props.theme.buttons.close ? 'block' : 'none')};
    right: 15px;
    top: 10px;
    content: '\f00d';
  }
`;

const FullScreen = Icon.extend`
  &::before {
    display: ${props => (props.theme.buttons.fullScreen ? 'block' : 'none')};
    left: 15px;
    top: 10px;
    content: ${props => (props.fullScreen ? '"\f066"' : '"\f065"')};
  }
  @media (max-height: ${props => props.height + 20}px),
    (max-width: ${props => props.width + 20}px) {
    &::before {
      content: '';
    }
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

function Top(props) {
  return (
    <TopMenu>
      <FullScreen
        width={props.width}
        height={props.height}
        fullScreen={props.fullScreen}
        onClick={props.switchSize}
      />
      <Cross onClick={props.switchMode} />
      {props.labels.webchatHeaderTitle}
    </TopMenu>
  );
}

Top.propTypes = {
  switchMode: PropTypes.func.isRequired,
  switchSize: PropTypes.func.isRequired,
  fullScreen: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  labels: PropTypes.shape({
    webchatHeaderTitle: PropTypes.string,
  }).isRequired,
};

export default WithLabels(Top);
