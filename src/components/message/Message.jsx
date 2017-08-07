import styled from 'styled-components';

import Text from './Text';
import Table from './Table';
import ButtonList from './ButtonList';

export default ({ type, ...props }) => {
  switch (type) {
    case 'text':
      return <Text {...props} />;
      break;
    case 'table':
      return <Table {...props} />;
      break;
    case 'choices':
      return <ButtonList {...props} />;
      break;
    default:
      return <Text {...props} />;
      break;
  }
};
