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

// Actions helpers

/**
 * Gets action background color depending on component status
 * @param props - component properties
 * @returns {string} - the background color
 */
const getStatusBackgroundColor = (props) => {
  if (props.disabled) {
    return 'transparent';
  }

  if (props.clicked) {
    return props.theme.colors.primary;
  }

  return 'transparent';
};

/**
 * Gets action text color depending on component status
 * @param props
 * @returns {string} - the text color
 */
const getStatusColor = (props) => {
  if (props.disabled) {
    return 'lightgrey';
  }

  if (props.clicked) {
    return props.theme.colors.primaryText;
  }

  return props.theme.colors.primary;
};

// CardLink action
const Link = styled.a`
  font-size: 15px;
  font-weight: 300;
  padding: 10px;
  background-color: ${props => getStatusBackgroundColor(props)};
  color: ${props => getStatusColor(props)};
  text-align: center;
  cursor: pointer;
  transition: all 400ms ease;

  &:hover {
    ${props => !props.disabled && !props.clicked && `background-color: ${darken(0.03, props.theme.colors.secondary)}`};
  }
  &:focus {
    outline: none;
  }
  ${props => (props.clicked || props.disabled ? 'pointer-events: none' : '')};
`;

const CardLink = ({ label, link, handleClick, disabled, clicked }) => (
  <Link href={link} onClick={handleClick} target="_blank" disabled={disabled} clicked={clicked}>
    {label}
  </Link>
);

CardLink.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  clicked: PropTypes.bool.isRequired,
};

// CardButton action
const Button = styled.div`
  font-size: 15px;
  padding: 10px;
  text-align: center;
  background-color: ${props => getStatusBackgroundColor(props)};
  color: ${props => getStatusColor(props)};
  cursor: ${props => (props.disabled || props.clicked ? 'default' : 'pointer')};
  transition: all 400ms ease; 

  &:hover {
    ${props => !props.disabled && !props.clicked && `background-color: ${darken(0.03, props.theme.colors.secondary)}`};
  }
  &:focus {
    outline: none;
  }
`;

const CardButton = ({ handleClick, label, disabled, clicked }) => (
  <Button
    onClick={disabled || clicked ? () => null : handleClick}
    disabled={disabled}
    clicked={clicked}
  >
    {label}
  </Button>
);

CardButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  clicked: PropTypes.bool,
};

CardButton.defaultProps = {
  disabled: false,
  clicked: false,
};

// CardActions component
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
              <CardLink
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
              <CardButton
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
