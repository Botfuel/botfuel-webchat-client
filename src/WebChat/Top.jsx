import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Icon = styled.span`
  cursor: pointer;
  &::before {
    position: absolute;
    color: #ddd;
    font-size: 10px;
  }
`;

const Cross = Icon.extend`
  &::before {
    right: 15px;
    top: 10px;
    content: "╳";
  }
`;

const FullScreen = Icon.extend`
  &::before {
    left: 15px;
    top: 10px;
    content: "▢";
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
      <FullScreen onClick={props.switchSize} />
      <Cross onClick={props.switchMode} />
      Comment puis-je vous aider ?
    </TopMenu>
  );
}

Top.propTypes = {
  switchMode: PropTypes.func.isRequired,
  switchSize: PropTypes.func.isRequired,
};
