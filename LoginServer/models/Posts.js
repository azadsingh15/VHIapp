const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const finddate = () => {
  var d = new Date();
  const parts = d.toString().split(" ");
  const datetime =
    parts[0] +
    " " +
    parts[1] +
    " " +
    parts[2] +
    " " +
    parts[3] +
    " " +
    parts[4];
  return datetime;
};
const PostSchema = new Schema({
  user_id: {
    type: ObjectId,
    required: true,
  },
  display_name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  timestamp: {
    type: String,
    default: finddate(),
  },
});

const PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;
