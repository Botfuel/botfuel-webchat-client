import PropTypes from 'prop-types';
import renderTextWithLinks from 'utils/text-with-links';

export default function TextMessage({ payload }) {
  return renderTextWithLinks(payload.textValue || payload.text);
}

TextMessage.propTypes = {
  payload: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]).isRequired,
};
