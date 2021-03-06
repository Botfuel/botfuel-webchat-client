import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Image = styled.img`
  max-width: 100%;
  width: auto;
  height: auto;
  max-height: 300px;
  border-radius: ${props => props.theme.layout.rounded};
`;

export default function ImageMessage({ payload: { imageUrl } }) {
  return <Image src={imageUrl} />;
}

ImageMessage.propTypes = {
  payload: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]).isRequired,
};
