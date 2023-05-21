const {Thought, User} = require('../models');

module.exports = {
    getThoughts(req, res){
        Thought.find()
            .select('-__v')
            .then ((thoughts) => res.status(200).json(thoughts))
            .catch ((err) => res.status(500).json(err));
    },
    getSingleThought(req, res){
        Thought.findOne({_id : req.params.thoughtId})
            .select('-__v')
            .then ((thought)=> {
                !thought
                    ? res.status(404).json({message: "There is no thought with this id!"})
                    : res.status(200).json(thought);
            })
            .catch ((err) => res.status(500).json(err));
    },
    createThought(req, res){
        Thought.create(req.body)
            .then ((thought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: {thoughts: thought._id} },
                    { new: true }
                  );
            })
            .then((user) =>{
                !user
                    ? res.status(404).json({
                        message: 'The thought is created, but no user is found with that ID!',
                        })
                    : res.status(200).json('The tought is created!')
            })
            .catch ((err) => res.status(500).json(err));
    },
  /*  updateUser(req, res){
        User.findByIdAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
            .select('-__v')
            .then((user)=>
                !user
                ? res.status(404).json({message: "There is no user with this id!"})
                : res.status(200).json(user)
            )
            .catch ((err) => res.status(500).json(err));
    }*/
}