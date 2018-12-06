import uuidv4 from 'uuid/v4';
import gql from 'graphql-tag';

const GET_LOCAL_MESSAGES = gql`
  query {
    localMessages @client
  }
`;

module.exports = {
  defaults: {
    localMessages: [],
  },
  resolvers: {
    Mutation: {
      createLocalTextMessage: (_, { user, bot, value }, { cache }) => {
        const query = GET_LOCAL_MESSAGES;
        const localMessages = cache.readQuery({ query });
        const textMessage = {
          id: uuidv4(),
          bot,
          user,
          payload: {
            textValue: value,
          },
          type: 'text',
          sender: 'user',
        };
        const data = { localMessages: [...localMessages, textMessage] };
        cache.writeQuery({ query, data });
        return null;
      },
    },
  },
};
