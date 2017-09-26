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

const Actions = ({ payload, sendAction, markAsClicked }) => {
  const hasAClickedAction = payload.actionValue.some(a => !!a.clicked);
  const actions = payload.actionValue.map(a => ({
    ...a,
    ...{
      disabled: !a.clicked && hasAClickedAction,
      clicked: !!a.clicked,
    },
  }));

  return (
    <Container size={actions.length}>
      {actions &&
        actions.map((action, index) => {
          switch (action.type) {
            case 'link':
              return (
                <LinkButton
                  index={index}
                  key={action.linkActionValue}
                  link={action.linkActionValue}
                  label={action.text || action.linkActionValue}
                  handleClick={() => markAsClicked(index)}
                  disabled={action.disabled}
                  clicked={action.clicked}
                />
              );
            case 'postback':
              return (
                <TextButton
                  index={index}
                  key={JSON.stringify(action.postbackActionValue)}
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
  markAsClicked: PropTypes.func.isRequired,
};

Actions.defaultProps = {
  sendAction: () => null,
};

export default Actions;
