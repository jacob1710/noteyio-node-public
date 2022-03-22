const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    index: true,
  },
  imgId: String,
  tags: [{
    type: String,
  }],
  title: {
    type: String,
    required: true,
    index: true,
  },
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
