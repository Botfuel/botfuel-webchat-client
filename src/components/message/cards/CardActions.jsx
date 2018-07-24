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
import CardTextButton from './CardTextButton';
import CardLinkButton from './CardLinkButton';

const Container = styled.div`
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  
  > * {
    flex: 1;
  }
  
  a, div {
    border-top: 1px solid #f5f5f5;
  }
`;

const CardActions = ({ payload, sendAction, markAsClicked, width }) => {
  const hasAClickedAction = payload.actionValue.some(a => !!a.clicked);
  const actions = payload.actionValue.map(a => ({
    ...a,
    ...{
      disabled: !a.clicked && hasAClickedAction,
      clicked: !!a.clicked,
    },
  }));

  return (
    <Container actions={actions} width={width}>
      {actions &&
      actions.map((action, index) => {
        switch (action.type) {
          case 'link':
            return (
              <CardLinkButton
                index={index}
                key={`${action.text}${action.linkActionValue}`}
                link={action.linkActionValue}
                label={action.text || action.linkActionValue}
                handleClick={() => markAsClicked(index)}
                disabled={action.disabled}
                clicked={action.clicked}
                side="left"
              />
            );
          case 'postback':
            return (
              <CardTextButton
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
                side="left"
              />
            );
          default:
            return null;
        }
      })}
    </Container>
  );
};

CardActions.propTypes = {
  payload: PropTypes.shape({
    value: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(['postback', 'link']).isRequired,
        text: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      }),
    ),
  }).isRequired,
  sendAction: PropTypes.func,
  markAsClicked: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
};

CardActions.defaultProps = {
  sendAction: () => null,
};

export default CardActions;
