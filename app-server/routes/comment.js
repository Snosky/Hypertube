const Comment = require('../models/comment');

module.exports.addComment = function (req, res) {
    if (!req.payload._id)
        return res.status(401).json({ "message" : "UnauthorizedError: private profile" });

    req.checkBody('comment', "comment is not valid").notEmpty().isLength({min: 0, max: 500});

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).json({errors: result.useFirstErrorOnly().mapped()});
        }
        let comment = new Comment();
        comment.comment = req.body.comment;
        comment.user_id = req.payload._id;
        comment.imdb_code = req.body.imdb_code;
        comment.created_at = new Date();
        comment.save(function (err) {
            if(err)
                return res.status(500).json(err);
            return res.status(200).json(comment);
        });
    });
};



module.exports.getComment = function(req, res){
    Comment.find({imdb_code : req.params.imdb_code})
        .populate('user_id', {username: 1, _id: 1, pic: 1})
        .sort({created_at: -1})
        .exec(function (err, comment) {
        if(err)
            return res.status(500).json(err);
        return res.status(200).json(comment);
    });
};