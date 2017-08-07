import React from 'react';
import PropTypes from 'prop-types';

import Text from './Text';
import Table from './Table';
import ButtonList from './ButtonList';

export default function Message({ type, ...props }) {
  switch (type) {
    case 'text':
      return <Text {...props} />;
    case 'table':
      return <Table {...props} />;
    case 'choices':
      return <ButtonList {...props} />;
    default:
      return <Text {...props} />;
  }
}

Message.propTypes = {
  type: PropTypes.string.isRequired,
};
