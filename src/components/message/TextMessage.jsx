import React from 'react';
import PropTypes from 'prop-types';
import TextWithLinks from 'components/ui/TextWithLinks';

export default function TextMessage({ payload }) {
  return <TextWithLinks text={payload.textValue || payload.text} />;
}

TextMessage.propTypes = {
  payload: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]).isRequired,
};
