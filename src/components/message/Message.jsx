import React from 'react';
import styled from 'styled-components';

import Text from './Text';
import Table from './Table';
import ButtonList from './ButtonList';

export default ({ type, ...props }) => {
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
};
