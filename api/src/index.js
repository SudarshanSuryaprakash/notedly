require('dotenv').config();
const db = require('./db');
const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express')

const models = require("./models");
const { model } = require('./models/note');

const port = process.env.port || 4000
const DB_HOST = process.env.DB_HOST



let notes = [
    {
        id: '1',
        content: 'This is a note',
        author: 'Sudarshan Suryaprakash'
    },
    { id: '2', content: 'This is another note', author: 'Sarah Pearl' },
    { id: '3', content: 'Oh hey look, another note!', author: 'Lulu' }
]

const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }
    type Query {
        hello: String!
        notes: [Note!]!
        note(id: ID!): Note!
    }
    type Mutation {
        newNote(content: String!): Note!
    }
`;

const resolvers = {
    Query: {
        hello : () => 'Hello World!',
        notes: async () => await models.Note.find(),
        note: (parent, args) => {
            return models.Note.findById(args.id)
        }
    },
    Mutation: {
        newNote: async (parent, args) => {
            return await models.Note.create({
                content: args.content,
                author: 'Sudarshan'
            })
        }
    }
}

const app = express()

db.connect(DB_HOST)

const server = new ApolloServer({typeDefs, resolvers})

server.applyMiddleware({app, path: '/api'});

app.listen({port}, () => console.log(`GraphQL Server running at port ${port} ${server.graphqlPath}`))