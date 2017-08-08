import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #f8f9fa;
  padding: 18px 18px 22px;
  border-bottom: 1px solid #e6e6e6;
  min-height: 90px;
  margin: -10px -10px 10px;
`;

const Title = styled.div`
  color: #464646;
  font-size: 18px;
  font-weight: 700;
`;

const Text = styled.div`
  color: #787f8c;
  font-size: 13px;
  line-height: 1.3;
  margin-top: 8px;
`;

export default function TextMessage({ value }) {
  return (
    <Container>
      <Title>
        {value.title}
      </Title>
      <Text>
        {value.text}
      </Text>
    </Container>
  );
}

TextMessage.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]).isRequired,
};
