import React from 'react';
import styled from 'styled-components';

import Button from './Button';

export default ({ value }) =>
  (<div>
    {value && value.map(choice => <Button text={choice.text} />)}
  </div>);
