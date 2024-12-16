const express = require('express');
const Transaction = require('../Models/TransactionModel');
const User = require('../Models/UserModel'); 
const router = express.Router();

router.post('/add-transaction', async (req, res) => {
    const { email, category,amount,description } = req.body;
    if(!email){
        console.log("Please login first");
    }

    try {
        const newEntry = new Transaction({ category,amount,description });
        const savedEntry = await newEntry.save();

        const user = await User.findOneAndUpdate(
            { email },
            { $push: { entryIds: savedEntry._id } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found. Cannot save entry ID.' });
        }

        res.status(201).json({ message: 'Entry added successfully!', entryId: savedEntry._id });
    } catch (err) {
        res.status(500).json({ message: 'Error adding entry', error: err.message });
    }
});

module.exports = router;