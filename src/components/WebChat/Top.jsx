/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import WithLabels from 'components/utils/WithLabels';

const Icon = styled.span`
  font-family: 'font-awesome';
  cursor: pointer;
  &::before {
    position: absolute;
    color: #ddd;
    font-size: 16px;
  }
`;

const Cross = styled(Icon)`
  &::before {
    display: ${props => (props.theme.buttons.close ? 'block' : 'none')};
    right: 15px;
    top: 10px;
    content: '\\f00d';
  }
`;

const FullScreen = styled(Icon)`
  &::before {
    display: ${props => (props.theme.buttons.fullScreen ? 'block' : 'none')};
    left: 15px;
    top: 10px;
    content: ${props => (props.fullScreen ? '"\\f066"' : '"\\f065"')};
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
      {!props.disableFullScreenButton && (
        <FullScreen
          width={props.width}
          height={props.height}
          fullScreen={props.fullScreen}
          onClick={props.switchSize}
        />
      )}
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
  disableFullScreenButton: PropTypes.bool.isRequired,
};

export default WithLabels(Top);
