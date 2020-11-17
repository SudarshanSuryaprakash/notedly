const {gql} = require('apollo-server-express')


module.exports = gql`
    scalar DateTime
    type Note {
        id: ID!
        content: String!
        author: User!
        createdAt: DateTime!
        updatedAt: DateTime!
    }
    type User {
        id: ID!
        userName: String!
        email: String!
        avatar: String!
        notes: [Note!]!
    }
    type Query {
        notes: [Note!]!
        note(id: ID!): Note!
    }
    type Mutation {
        newNote(content: String!): Note!
        updateNote(id: ID!, content: String!): Note!
        deleteNote(id: ID!): Boolean!

        signUp(userName: String!, email: String!, password: String): String!
        signIn(userName: String, email: String, password: String!): String!
    }
`;