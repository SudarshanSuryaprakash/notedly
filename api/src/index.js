require('dotenv').config();
const db = require('./db');
const express = require('express');
const {ApolloServer} = require('apollo-server-express')
const jwt = require('jsonwebtoken')

const models = require("./models");
const { model } = require('./models/note');

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const port = process.env.port || 4000
const DB_HOST = process.env.DB_HOST

const getUser = token => {
    if(token) {
        
        try {
            return jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            throw new Error('Session Invalid')
        }
    }
}


const app = express()

db.connect(DB_HOST)

const server = new ApolloServer({typeDefs, resolvers, context: ({req}) => {
    const token = req.headers.authorization;
    const user = getUser(token);
    console.log(user)
    return {models, user}
} })

server.applyMiddleware({app, path: '/api'});

app.listen({port}, () => console.log(`GraphQL Server running at port ${port} ${server.graphqlPath}`))