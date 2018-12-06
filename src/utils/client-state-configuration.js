import gql from 'graphql-tag';

const GET_LOCAL_MESSAGES = gql`
  query {
    localMessages @client
  }
`;

export default {
  defaults: {
    localMessages: [],
  },
  resolvers: {
    Mutation: {
      createLocalTextMessage: (_, { user, bot, value, localMessageId }, { cache }) => {
        const query = GET_LOCAL_MESSAGES;
        const cacheData = cache.readQuery({ query });
        const textMessage = {
          id: localMessageId,
          bot,
          user,
          payload: {
            textValue: value,
          },
          type: 'text',
          sender: 'user',
        };
        const data = { localMessages: [...cacheData.localMessages, textMessage] };
        cache.writeQuery({ query, data });
        return null;
      },
    },
  },
};
