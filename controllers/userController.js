const { Thought } = require('../models');
const User = require('../models/User');

module.exports = {
    getUsers(req, res){
        User.find()
            .select('-__v')
            .populate("thoughts", "-__v -reactions._id")
            .populate("friends", "-__v")
            .then ((users) => res.status(200).json(users))
            .catch ((err) => res.status(500).json(err));
    },
    getSingleUser(req, res){
        User.findOne({_id : req.params.userId})
            .select('-__v')
            .populate("thoughts", "-__v -reactions._id")
            .populate("friends", "-__v")
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
            .populate("thoughts", "-__v -reactions._id")
            .populate("friends", "-__v")
            .then((user)=>
                !user
                ? res.status(404).json({message: "There is no user with this id!"})
                : res.status(200).json(user)
            )
            .catch ((err) => res.status(500).json(err));
    },
    addFriend(req, res){
        //First we have to check if there is a user with the id of our friend or not
        User.findOne({_id : req.params.friendId})
            .then((friend)=>
                !friend
                ? res.status(404).json({message: "There is no user with this friend id!"})
                //Then if we found a friend with this id we try to add it to the list of our friends
                : User.findByIdAndUpdate(
                    {_id: req.params.userId},
                    {$addToSet: {friends: req.params.friendId}},
                    {runValidators: true, new: true}
                )
                    .select('-__v')
                    .populate("thoughts", "-__v -reactions._id")
                    .populate("friends", "-__v")
                    .then((user)=>
                    //Here it checkes if there is a user with the id of userId, if yes it adds friend's id to the array of friends
                        !user
                        ? res.status(404).json({message: "There is no user with this id!"})
                        : res.status(200).json(user)
                    )
                    .catch ((err) => res.status(500).json(err))
            )
    },
    removeFriend(req, res){
        //First we have to check if there is a user with the id of our friend or not
        User.findOne({_id : req.params.friendId})
            .then((friend)=>
                !friend
                ? res.status(404).json({message: "There is no user with this friend id!"})
                //Then if we found a friend with this id we try to delete it from the list of our friends
                : User.findByIdAndUpdate(
                    {_id: req.params.userId},
                    {$pull: {friends: req.params.friendId}},
                    {runValidators: true, new: true}
                )
                    .select('-__v')
                    .populate("thoughts", "-__v -reactions._id")
                    .populate("friends", "-__v")
                    .then((user)=>
                    //Here it checkes if there is a user with the id of userId, if yes it removes friend's id from the array of friends
                        !user
                        ? res.status(404).json({message: "There is no user with this id!"})
                        : res.status(200).json(user)
                    )
                    .catch ((err) => res.status(500).json(err))
            )
    },
    removeUser(req, res) {
        //here we delete a user
        User.findByIdAndRemove({ _id: req.params.userId })
          .then((user) => {
            let deletedUser = user;
            //then we find all the users who have the deleted user inside the list of their friends
            return User.find({ friends: req.params.userId });
          })
          .then((userFriend) => {
            if (!userFriend) {
              return res.status(200).json({ message: "The user wasn't in the friends' list of any other users!" });
            }
      
            const promises = [];
            /* we iterate through the returned array from the find method and for deleting the id of deleted user from the friends
            list of the other users,we add the promise of User.findOneAndUpdate for each one of them to an array 
            and then we run all promises at once*/
            for (let i = 0; i < userFriend.length; i++) {
              promises.push(
                User.findOneAndUpdate(
                  { _id: userFriend[i]._id },
                  { $pull: { friends: req.params.userId } },
                  { runValidators: true, new: true }
                )
              );
            }
      
            return Promise.all(promises);
          })
          .then((results) => {
            for (let i = 0; i < results.length; i++) {
              res.status(200).json({ message: `The user was deleted from the friends' list of ${userFriend[i].username}!` });
            }
          })
          .catch((err) => res.status(500).json(err));
      }
      
}