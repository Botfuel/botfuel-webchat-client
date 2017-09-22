import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextButton from './TextButton';
import LinkButton from './LinkButton';

const Container = styled.div`
  text-align: right;
  display: flex;
  justify-content: flex-end;

  > * {
    margin-left: ${props => 5 / props.size}%;
    width: ${props => 90 / props.size}%;
    max-width: 200px;
  }
`;

const Actions = ({ payload, sendAction }) => {
  const actions = payload.actionValue;

  return (
    <Container size={actions.length}>
      {actions &&
        actions.map((action) => {
          switch (action.type) {
            case 'text':
              return (
                <TextButton
                  key={action.textActionValue}
                  handleClick={sendAction({ type: 'text', value: action.textActionValue })}
                  label={action.text || action.textActionValue}
                />
              );
            case 'link':
              return (
                <LinkButton
                  key={action.textActionValue}
                  link={action.textActionValue}
                  label={action.text || action.textActionValue}
                />
              );
            case 'postback':
              return (
                <TextButton
                  key={action.postbackActionValue}
                  handleClick={sendAction({
                    type: 'postback',
                    value: action.postbackActionValue,
                    text: action.text,
                  })}
                  label={action.text || action.postbackActionValue}
                />
              );
            default:
              return null;
          }
        })}
    </Container>
  );
};

Actions.propTypes = {
  payload: PropTypes.shape({
    value: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(['text', 'postback', 'link']).isRequired,
        text: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      }),
    ),
  }).isRequired,
  sendAction: PropTypes.func,
};

Actions.defaultProps = {
  sendAction: () => null,
};

export default Actions;
