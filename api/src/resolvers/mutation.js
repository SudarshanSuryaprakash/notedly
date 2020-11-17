const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express')
require('dotenv').config()

const gravatar = require('../util/gravatar');


module.exports = {
    signUp: async (parent, {userName, email, password}, {models}) => {
        
        email = email.trim().toLowerCase();
        
        const hashed = await bcrypt.hash(password, 10);
        const avatar = gravatar(email);
        try {
            const user = models.User.create({
                email,
                userName,
                password: hashed,
                avatar
            });
            return jwt.sign({id: user._id}, process.env.JWT_SECRET)
        } catch (err) {
            throw new Error('Error creating account')
        }
    },

    signIn: async (parent, {userName, email, password}, {models}) => {
        if(email) email = email.trim().toLowerCase();
        const user = await models.User.findOne({
            $or: [{email}, {userName}]
        })
        if(!user) throw new AuthenticationError('Error Signing in')
        const valid = await bcrypt.compare(password, user.password)
        if(!valid) throw new AuthenticationError('Error Signing in')
        return jwt.sign({id: user._id}, process.env.JWT_SECRET)
    },

    newNote: async (parent, args, {models}) => {
        return await models.Note.create({
            content: args.content,
            author: 'Sudarshan'
        })
    },
    deleteNote: async (parent, {id}, {models}) => {
        try {
            await models.Note.findOneAndRemove({_id: id})
            return true
        } catch (error) {
            return false
        }
    },
    updateNote: async(parent, {id, content}, {models}) => {
      
            return await models.Note.findOneAndUpdate({
                _id: id
            },
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
            )
       
        
    }
}