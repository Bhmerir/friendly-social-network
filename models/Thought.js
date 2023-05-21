const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 80
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        username: {
            type: String,
            required: true,
            trim: true
        },
        reactions:[reactionSchema]
    },
    {
      toJSON: {
        getters: true,
        virtuals: true
      }
    }
)
thoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
})

thoughtSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.id; // Exclude the virtual's 'id' field
      return ret;
    }
});

const Thought = model('thought', thoughtSchema)
module.exports= Thought;