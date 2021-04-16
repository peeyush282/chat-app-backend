const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    content: { type: String, unqiue: true },
    from: { type: Schema.Types.ObjectId, ref: "user", required: true },
    to: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", MessageSchema);
