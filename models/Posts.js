const mongoose = require('mongoose');

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
        required: true,
      },
      comments:[
        { type: ObjectId, ref: 'Order' }
        ]
    }, { timestamps: true });

const Post = mongoose.model('Product', PostSchema);

module.exports = Post;