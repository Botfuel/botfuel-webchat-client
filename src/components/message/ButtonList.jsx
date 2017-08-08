import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

export default function ButtonList({ value }) {
  return (
    <div>
      {value && value.map(choice => <Button key={choice.id} text={choice.text} />)}
    </div>
  );
}

ButtonList.propTypes = {
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
};
