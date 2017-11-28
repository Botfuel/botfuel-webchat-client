/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

const Thead = styled.thead`
  tr {
    border-bottom: 1px solid;
  }
`;

const Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  empty-cells: show;
  max-width: 100%;
  display: block;
  overflow-x: auto;
  overflow-y: hidden;

  td,
  th {
    padding: 5px 5px;
    border-right: 1px solid;
    &:last-of-type {
      border-right: 0;
    }
  }
`;

function generateTable(value) {
  const header = value.schema.map(h => <th key={h.key}>{h.label}</th>);
  const rows = value.rows.map(row => (
    <tr key={uuidv4()}>{value.schema.map(h => <td key={h.key}>{row[h.key]}</td>)}</tr>
  ));
  return (
    <Table>
      <Thead>
        <tr>{header}</tr>
      </Thead>
      <tbody id="tbody">{rows}</tbody>
    </Table>
  );
}

export default function MessageTable({ payload }) {
  return <div>{generateTable(payload.tableValue)}</div>;
}

MessageTable.propTypes = {
  payload: PropTypes.shape({
    value: PropTypes.shape({
      schema: PropTypes.array.isRequired,
      rows: PropTypes.array.isRequired,
    }),
  }),
};
