const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    interests: [String],
    wishes: [String],
});

const Child = mongoose.model("Child", childSchema);
module.exports = Child;