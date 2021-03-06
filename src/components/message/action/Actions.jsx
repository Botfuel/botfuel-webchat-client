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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import pixelWidth from 'string-pixel-width';
import TextButton from './TextButton';
import LinkButton from './LinkButton';

const DISPLAY_HORIZONTAL = 'horizontal';
const DISPLAY_VERTICAL = 'vertical';
const DISPLAY_AUTO = 'auto';

const isOneLine = (props) => {
  const joinedText = props.actions.map(action => action.text).join(' ');
  const textWidth = pixelWidth(joinedText, { size: 15 });
  const actionsWidth = (props.actions.length * 20) + textWidth;
  return actionsWidth < (props.width * 0.8);
};

const verticalStyles = props => `
  text-align: right;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  
  > * {
    margin-left: ${5 / props.actions.length}%;
    width: 90%;
  }
`;

const horizontalStyles = props => `
  text-align: right;
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  
  > * {
    margin-left: ${5 / props.actions.length}%;
    width: ${90 / props.actions.length}%;
    max-width: 200px;
  }
`;

const getContainerStyle = (props) => {
  switch (props.theme.layout.buttonsDisplay) {
    case DISPLAY_HORIZONTAL:
      return horizontalStyles(props);
    case DISPLAY_VERTICAL:
      return verticalStyles(props);
    case DISPLAY_AUTO:
      return isOneLine(props) ? horizontalStyles(props) : verticalStyles(props);
    default:
      return horizontalStyles(props);
  }
};

const Container = styled.div`
  padding: 0 10px;
  ${props => getContainerStyle(props)}
`;

class Actions extends React.Component {
  shouldComponentUpdate(nextProps) {
    // update actions only if payload has changed
    const { payload } = this.props;
    return payload.actionValue !== nextProps.payload.actionValue;
  }

  render() {
    const { payload, sendAction, markAsClicked, width } = this.props;
    const hasAClickedAction = payload.actionValue.some(a => !!a.clicked);
    const actions = payload.actionValue.map(a => ({
      ...a,
      ...{
        disabled: !a.clicked && hasAClickedAction,
        clicked: !!a.clicked,
      },
    }));
    const msgClassName = payload.options && payload.options.className ? payload.options.className : '';

    return (
      <Container className={`bf-actions-container ${msgClassName}`} actions={actions} width={width}>
        {actions && actions.map((action, index) => {
          const actionClassName = action.options && action.options.className ? action.options.className : '';
          switch (action.type) {
            case 'link':
              return (
                <LinkButton
                  index={index}
                  key={`${action.text}${action.linkActionValue}`}
                  link={action.linkActionValue}
                  label={action.text || action.linkActionValue}
                  handleClick={() => markAsClicked(index)}
                  disabled={action.disabled}
                  clicked={action.clicked}
                  className={actionClassName}
                  side="left"
                />
              );
            case 'postback':
              return (
                <TextButton
                  index={index}
                  key={`${action.text}${JSON.stringify(action.postbackActionValue)}`}
                  handleClick={() => {
                    sendAction({
                      type: 'postback',
                      value: action.postbackActionValue,
                      text: action.text,
                    })();
                    markAsClicked(index);
                  }}
                  label={action.text || action.postbackActionValue}
                  disabled={action.disabled}
                  clicked={action.clicked}
                  className={actionClassName}
                  side="left"
                />
              );
            default:
              return null;
          }
        })}
      </Container>
    );
  }
}

Actions.propTypes = {
  payload: PropTypes.shape({
    actionValue: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(['text', 'postback', 'link']).isRequired,
        text: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      }),
    ),
  }).isRequired,
  sendAction: PropTypes.func,
  markAsClicked: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
};

Actions.defaultProps = {
  sendAction: () => null,
};

export default Actions;
