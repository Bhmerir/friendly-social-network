
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address!']
        },
        thoughts: [{ type: Schema.Types.ObjectId, ref: 'thought' }],
        friends:  [{ type: Schema.Types.ObjectId, ref: 'user' }]
    },
    {
      toJSON: {
        getters: true,
        virtuals: true
      }
    }
)
userSchema.virtual('friendCount').get(function(){
    return this.friends.length;
})

userSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.id; // Exclude the virtual's 'id' field
      return ret;
    }
});

const User = model('user', userSchema)
module.exports= User;
