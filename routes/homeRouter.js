const { response } = require("express");

const router = require("express").Router();
const fs = require('fs');

router.get("/", (req,res) => {
    res.sendFile('../public/index.html', 'utf-8');
});

module.exports = router;