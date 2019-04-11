const express = require('express');
const router = express.Router();
const passport = require('passport');

// categories model
const Categories = require('../models/Categories');

// get all categoies
router.get('/', (req, res) => {
    Categories.find().then(categories => res.json(categories))
        .catch(err => console.log(err))
})

// add Category
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    const newCategory = new Categories({
        title: req.body.title,
        user: req.user.id
    });

    newCategory.save().then(category => res.json(category));
});

// delete category
router.post('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Categories.deleteOne({ _id: req.params.id })
        .then(() => res.json({ success: true, id: req.params.id }))
        .catch(err => console.log(err))
})

// edit Category
router.post('/edit/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Categories.update({ _id: req.params.id }, {
            $set: {
                'title': req.body.title
            }
        })
        .then(result => {

            if (result) { res.json({ success: true, id: req.params.id, title: req.body.title }) }
        })
        .catch(err => console.log(err))
})

module.exports = router;