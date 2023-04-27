const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;
const PostSchema = new mongoose.Schema({

  title: {
    type: String,
    required: [true, 'Por favor ingrese un título'],
  },
  content: {
    type: String,
    required: [true, 'Por favor ingrese algo de contenido']
  },
  userId: {
    type: ObjectId,
    ref: 'User'
  },
  comments: [
    { type: ObjectId, ref: 'Comment' }
  ],
  likes: [{ type: ObjectId, ref: 'User' }],
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;