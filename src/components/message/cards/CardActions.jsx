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
import { darken } from 'polished';

// CardLink action
const CardLink = styled.a`
  font-size: 14px;
  padding: 10px;
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  text-align: center;
  cursor: pointer;
  transition: all 400ms ease;
  text-decoration: none;

  &:hover {
    background-color: ${props => darken(0.03, props.theme.colors.secondary)};
  }

  &:focus {
    outline: none;
  }
`;

// CardButton action
const CardButton = styled.button`
  font-size: 14px;
  padding: 10px;
  text-align: center;
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  transition: all 400ms ease;
  border: none;

  &:hover {
    background-color: ${props => darken(0.03, props.theme.colors.secondary)};
  }

  &:focus {
    outline: none;
  }
`;

// CardActions Container component
const Container = styled.div`
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  
  > * {
    flex: 1;
  }
  
  a, button {
    border-top: 1px solid #f5f5f5;
  }
`;

// CardActions component
const CardActions = ({ payload, sendAction }) => (
  <Container className="bf-card-actions">
    {payload.actionValue &&
    payload.actionValue.map((action) => {
      switch (action.type) {
        case 'link':
          return (
            <CardLink
              className="bf-card-action-link"
              key={`${action.text}${action.linkActionValue}`}
              href={action.linkActionValue}
              target="_blank"
            >
              {action.text || action.linkActionValue}
            </CardLink>
          );
        case 'postback':
          return (
            <CardButton
              className="bf-card-action-button"
              key={`${action.text}${JSON.stringify(action.postbackActionValue)}`}
              onClick={() => {
                sendAction({
                  type: 'postback',
                  value: action.postbackActionValue,
                  text: action.text,
                })();
              }}
            >
              {action.text || action.postbackActionValue}
            </CardButton>
          );
        default:
          return null;
      }
    })}
  </Container>
);

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
};

CardActions.defaultProps = {
  sendAction: () => null,
};

export default CardActions;
