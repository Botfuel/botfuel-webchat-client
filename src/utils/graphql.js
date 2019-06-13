// Remote messages
import gql from 'graphql-tag';

const MessageFragment = gql`
  fragment FullMessage on Message { 
    id
    type
    user
    bot
    sender
    createdAt
    payload {
      ... on Text {
        textValue: value
        options
      }
      ... on Table {
        tableValue: value {
          schema {
            key
            label
          }
          rows
        }
        options
      }
      ... on Actions {
        actionValue: value {
          ... on LinkAction {
            type
            text
            clicked
            linkActionValue: value
            options
          }
          ... on PostbackAction {
            type
            text
            clicked
            postbackActionValue: value
            options
          }
        }
        text
        options
      }
      ... on Postback {
        postbackValue: value
        text
        options
      }
      ... on Quickreplies {
        quickrepliesValue: value
        options
      }
      ... on BotAction {
        botActionValue: value {
          action
        }
      }
      ... on Image {
        imageUrl: value
        options
      }
      ... on Cards {
        cardsValues: value {
          title
          image_url
          actionValue: buttons {
            ... on LinkAction {
              type
              text
              linkActionValue: value
              options
            }
            ... on PostbackAction {
              type
              text
              postbackActionValue: value
              options
            }
          }
          subtitle
          options
        }
        options
      }
      ... on Hook {
        hookValue: value {
          name
          args
        }
      }
    }
  }
`;

export const MESSAGES_QUERY = gql`
  query messages($user: ID!, $bot: ID!) {
    messages(user: $user, bot: $bot) {
      ...FullMessage
    }
  }
  ${MessageFragment}
`;

export const MESSAGES_QUERY_SKIP = gql`
  query messages($user: ID!, $bot: ID!, $skip: Boolean!) {
    messages(user: $user, bot: $bot) @skip(if: $skip) {
      ...FullMessage
    }
  }
  ${MessageFragment}
`;

export const MESSAGES_SUBSCRIPTION = gql`
  subscription onMessageAdded($user: ID!, $bot: ID!) {
    messageAdded(user: $user, bot: $bot) {
      ...FullMessage
    }
  }
  ${MessageFragment}
`;

export const TEXT_MESSAGE_MUTATION = gql`
  mutation createTextMessage($user: ID!, $bot: ID!, $value: String!, $sender: String!, $referrer: String) {
    createTextMessage(user: $user, bot: $bot, value: $value, sender: $sender, referrer: $referrer) {
      ...FullMessage
    }
  }
  ${MessageFragment}
`;

export const POSTBACK_MESSAGE_MUTATION = gql`
  mutation createPostbackMessage(
    $user: ID!
    $bot: ID!
    $value: JSON!
    $text: String!
    $sender: String!
    $referrer: String
  ) {
    createPostbackMessage(user: $user, bot: $bot, value: $value, text: $text, sender: $sender, referrer: $referrer) {
      ...FullMessage
    }
  }
  ${MessageFragment}
`;

export const MARK_ACTION_AS_CLICKED_MUTATION = gql`
  mutation markActionAsClicked($message: ID!, $actionIndex: Int!) {
    markActionAsClicked(message: $message, actionIndex: $actionIndex) {
      ...FullMessage
    }
  }
  ${MessageFragment}
`;
