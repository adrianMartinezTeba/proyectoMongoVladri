const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;
const CommentSchema = new mongoose.Schema({

      text: {
        type: String,
        required: true,
      },
      userId: {
        type:ObjectId,
        ref: 'User',
        // required: true,
      },
      postsId:
        { type: ObjectId,
             ref: 'Post' }
        
    }, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;