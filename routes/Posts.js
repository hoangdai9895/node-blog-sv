const express = require('express');
const router = express.Router();
const passport = require('passport');

// categories model
const Posts = require('../models/Posts');
const Categories = require('../models/Categories');

// get all posts
router.get('/', (req, res) => {
    Posts.find().then(Posts => res.json(Posts))
        .catch(err => console.log(err))
})

// get 1 post
router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ noPostFound: "No post found with that id !!!" }))
})

// delete 1 post
router.post('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Posts.deleteOne({ _id: req.params.id })
        .then(() => res.json({ success: true, id: req.params.id }))
        .catch(err => console.log(err))
})

// add post
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    const newPost = new Posts({
        title: req.body.title,
        category: req.body.category,
        body: req.body.body,
        author: req.body.author,
        date: new Date(),
        user: req.user.id
    });

    newPost.save().then(post => res.json(post)).catch(err => console.log(err));
});

// edit post
router.post('/edit/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Posts.update({ _id: req.params.id }, {
            $set: {
                title: req.body.title,
                category: req.body.category,
                body: req.body.body,
                author: req.body.author,
                date: new Date(),
            }

        })
        .then(result => {
            let data = {
                title: req.body.title,
                category: req.body.category,
                body: req.body.body,
                author: req.body.author,
                date: new Date(),
            }
            if (result) { res.json({ success: true, id: req.params.id, editData: data }) }
        })
        .catch(err => console.log(err))
})

// comment
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.user.name,
                user: req.user.id
            }
            post.comments.unshift(newComment);
            post.save().then(post => res.json({ post: post, comment: newComment }))
        })
        .catch(err => res.status(404).json({ noPostFound: "No post found !!!s" }))
})

// delete comment
router.post('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({ commentNotExists: "Comment not exists" })
            }
            const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);
            post.comments.splice(removeIndex, 1);
            post.save().then(post => res.json({ post: post, post_id: req.params.id, comment_id: req.params.comment_id }))
        })
        .catch(err => console.log(err))
});



module.exports = router;