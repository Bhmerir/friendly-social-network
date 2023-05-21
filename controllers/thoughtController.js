const {Thought, User} = require('../models');

module.exports = {
    //show all thoughts
    getThoughts(req, res){
        Thought.find()
            .select('-__v -reactions._id')
            .then ((thoughts) => res.status(200).json(thoughts))
            .catch ((err) => res.status(500).json(err));
    },
    //show a thought by its id
    getSingleThought(req, res){
        Thought.findOne({_id : req.params.thoughtId})
            .select('-__v -reactions._id')
            .then ((thought)=> {
                !thought
                    ? res.status(404).json({message: "There is no thought with this id!"})
                    : res.status(200).json(thought);
            })
            .catch ((err) => res.status(500).json(err));
    },
    //create a new thought
    createThought(req, res){
        Thought.create(req.body)
            .then ((thought) => {
                //add the id of new thought to the array of thoughts in User
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
    //update a previous thought 
    updateThought(req, res){
        Thought.findByIdAndUpdate(
            {_id: req.params.thoughtId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
            .select('-__v -reactions._id')
            .then((thought)=>
                !thought
                ? res.status(404).json({message: "There is no thought with this id!"})
                : res.status(200).json(thought)
            )
            .catch ((err) => res.status(500).json(err));
    },
    //add a reaction to a thought
    createReactionToThought(req, res){
        Thought.findByIdAndUpdate(
            {_id: req.params.thoughtId},
            {$addToSet: {reactions: req.body}},
            {runValidators: true, new: true}
        )
            .select('-__v -reactions._id')
            .then((thought)=>
                !thought
                ? res.status(404).json({message: "There is no thought with this id!"})
                : res.status(200).json(thought)
            )
            .catch ((err) => res.status(500).json(err));
    },
    //add a reaction to a thought
    removeReactionFromThought(req, res){
        Thought.findByIdAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: {reactions: {reactionId: req.params.reactionId}}},
            {runValidators: true, new: true}
        )
            .select('-__v -reactions._id')
            .then((thought)=>
                !thought
                ? res.status(404).json({message: "There is no thought with this id!"})
                : res.status(200).json(thought)
            )
            .catch ((err) => res.status(500).json(err));
    },
    //delete a thought, and its reactions, and delete its id from the array of thoughts in User
    removeThought(req, res){
        Thought.findByIdAndRemove({_id: req.params.thoughtId})
            .then((thought) => 
                !thought
                    ? res.status(404).json({message: "There is no thought with this id!"})
                    : User.findOneAndUpdate(
                        {thoughts: req.params.thoughtId},
                        {$pull: {thoughts: req.params.thoughtId}},
                        {runValidators: true, new: true}
                    )
            )
            .then((user)=>
                !user
                    ? res.status(404).json({message: 'Thought is deleted but there is no user with this id!'})
                    : res.status(200).json({message: 'Thought is successfully deleted!'})
            )
            .catch ((err) => res.status(500).json(err));
    }
}
