import mongoose from 'mongoose'

const Schema = mongoose.Schema

const Memo = new Schema({
    writer: String,
    content: String,
    starred: [String],
    date: {
        created: { type: Date, default: Date.now },
        edited: { type: Date, default: Date.Now }
    },
    isEdited: { type: Boolean, default: false }
})

export default mongoose.model('memo', Memo)