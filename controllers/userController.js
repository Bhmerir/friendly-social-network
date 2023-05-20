const User = require('../models/User');

module.exports = {
    getUsers(req, res){
        User.find()
            .select('-__v')
            .then ((users) => res.status(200).json(users))
            .catch ((err) => res.status(500).json(err));
    },
    getSingleUser(req, res){
        User.findOne({_id : req.params.userId})
            .select('-__v')
            .then ((user)=> {
                !user
                    ? res.status(404).json({message: "There is no user with this id!"})
                    : res.status(200).json(user);
            })
            .catch ((err) => res.status(500).json(err));
    },
    createUser(req, res){
        User.create(req.body)
            .then ((user) => res.status(200).json(user))
            .catch ((err) => res.status(500).json(err));
    },
    updateUser(req, res){
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
    }
}