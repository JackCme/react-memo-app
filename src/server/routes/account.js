import express from 'express'
import Account from '../models/account'

const router = express.Router()

/**
|--------------------------------------------------
| Account signup: POST /api/account/signup
| Body sample: { "username" : "test", "password": "test" }
| Error codes:
|   1001: Bad username
|   1002: Bad password
|   1003: Existing username
|--------------------------------------------------
*/
router.post('/signup', (req, res) => {
    //Checks username format
    let usernameRegex = /^[a-z0-9_]+$/
    let username = req.body.username.toLowerCase()
    if(!usernameRegex.test(username) || username.length <= 4 || username.length >= 20) {
        return res.status(400).json({
            error: "Bad username",
            code: 1001
        })
    }

    //Checks password length
    let password = req.body.password
    if (password.length <= 4 || typeof password !== "string") {
        return res.status(400).json({
            error: "Bad password",
            code: 1002
        })
    }

    //Checks user existance
    Account.findOne({ username: username }, (err, exists) => {
        if(err) throw err
        if(exists) {
            return res.status(400).json({
                error: "Existing username",
                code: 1003,
            })
        }

        //create account
        let account = new Account({
            username: req.body.username.toLowerCase(),
            password: req.body.password
        })

        account.password = account.generateHash(account.password)

        account.save((err) => {
            if(err) throw err
            return res.json({ success: true })
        })
    })


})

/**
|--------------------------------------------------
| Account signin: POST /api/account/signin
| Body sample: { "username": "test", "password": "test" }
| Error codes:
|   1001: Login Failed
|   1002: User does not exist
|--------------------------------------------------
*/
router.post('/signin', (req, res) => {
    let password = req.body.password
    if(typeof password !== 'string') {
        return res.status(401).json({
            error: 'Login failed',
            code: 1001
        })
    }

    //find user by username
    Account.findOne({ username: req.body.username.toLowerCase() }, (err, account) => {
        if(err) throw err
        if(!account) {
            return res.status(401).json({
                error: 'user does not exist',
                code: 1002
            })
        }

        if(!account.validateHash(req.body.password)) {
            return res.status(403).json({
                error: 'login failed',
                code: 1001
            })
        }
        //alter sesson
        let session = req.session
        session.loginInfo = {
            _id: account._id,
            username: account.username
        }

        return res.json({
            success: true
        })
    })
})

/**
|--------------------------------------------------
| Get current user info: GET /api/account/getInfo
|--------------------------------------------------
*/
router.get('/getInfo', (req, res) => {
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(401).json({
            error: 1001
        })
    }

    res.json({ info: req.session.loginInfo })
    
})

/**
|--------------------------------------------------
| Logout: POST /api/account/logout
|--------------------------------------------------
*/
router.post('/logout', (req, res) => {
    req.session.destroy(err => { if(err) throw err })
    return res.json({ success: true })
})

/**
|--------------------------------------------------
| Search a user: GET /api/account/search/:username
|--------------------------------------------------
*/
router.get('/search/:username', (req, res) => {
    //block empty search request
    if(req.params.username && req.params.username.trim() !== '' ) {
        //search usernames that starts with given keyword using regex
        let re = new RegExp('^' + req.params.username)

        Account.find({ username: { $regex: re } }, { _id: true, username: true })
            .limit(5)
            .sort({ username: 1 })
            .exec((err, accounts) => {
                if (err) throw err
                res.json(accounts)
            })
    }
    else {
        res.json([])
    }
    
})

router.get('/search', (req, res) => {
    res.json([])
})
export default router