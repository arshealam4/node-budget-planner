import * as mongoose from "mongoose";
import db from "../lib/maindb";
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["budget", "expenses"],
    default: "expenses",
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  purpose: {
    type: String,
    required: true,
  },

  timestamp: { type: Date, default: Date.now },
});

const model = db.model("budget", budgetSchema);

export default model;
