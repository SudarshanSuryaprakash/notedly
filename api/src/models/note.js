const mongoose = require('mongoose')

const noteSchea = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        }

    },
    {
        timestamps: true
    }
)

const Note = mongoose.model('Note', noteSchea);

module.exports = Note;