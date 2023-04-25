const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;
const PostSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      user: {
        type:ObjectId,
        ref: 'User',
        // required: true,
      },
      comments:[
        { type: ObjectId, ref: 'Comment' }
        ]
    }, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;