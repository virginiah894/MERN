const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// our database structure
const DataSchema = new Schema(
    {
        id:Number,
        message: String
    },
    {timestamps:true}
);

module.exports = mongoose.model("Data",DataSchema)