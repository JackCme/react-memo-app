import express from 'express'
import Memo from '../models/memo'
import mongoose from 'mongoose'

const router = express.Router()

/**
|--------------------------------------------------
| Write a memo: POST /api/memo
| Body sample: { contents: "sample" }
| Error codes:
|   1001: Not logged in
|   1002: Empty contents
|--------------------------------------------------
*/
router.post('/', (req, res) => {
    //check login status
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: 'Not logged in',
            code: 1001,
        })
    }

    //check if content is valid
    if(typeof req.body.contents !== 'string') {
        return res.status(400).json({
            error: 'Invalid content',
            code: 1002,
        })
    }

    if(req.body.contents === ' ') {
        return res.status(400).json({
            error: 'Empty content',
            code: 1003,
        })
    }

    let memo = new Memo({
        writer: req.session.loginInfo.username,
        contents: req.body.contents
    })

    memo.save( err => {
        if(err) throw err
        return res.json({ success: true })
    })
})

/**
|--------------------------------------------------
| Modifies a memo: PUT /api/memo/:id
| Body sample: { "contents" : "sample" }
| Error Codes:
|   1001: Invalid id
|   1002: Inalid content
|   1003: Not logged in
|   1004: No resource
|   1005: Permission denied
|--------------------------------------------------
*/
router.put('/:id', (req, res) => {
    //check memo id validity
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: 'Invalid id',
            code: 1001,
        })
    }

    //check content validity
    if(typeof req.body.contents !== 'string') {
        return res.status(400).json({
            error: 'Invalid contents',
            code: 1002
        })
    }
    if(req.body.contents === '') {
        return res.status(400).json({
            error: 'Empty contents',
            code: 1002,
        })
    }

    //check login status
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: 'Not logged in',
            code: 1003,
        })
    }

    //find Memo
    Memo.findById(req.params.id, (err, memo) => {
        if(err) throw err

        //if memo does not exists
        if(!memo) {
            return res.status(404).json({
                error: 'No memo found',
                code: 1004,
            })
        }

        //check memo writer
        if(memo.writer != req.session.loginInfo.username) {
            return res.status(403).json({
                error: 'permission denied',
                code: 1005,
            })
        }

        //modify and save
        memo.contents = req.body.contents
        memo.date.edited = new Date()
        memo.isEdited = true

        memo.save((err, memo) => {
            if(err) throw err
            return res.json({
                success: true,
                memo
            })
        })
    })
})

/**
|--------------------------------------------------
| Deletes a memo: DELETE /api/memo/:id
| Error Codes:
|   1001: Invalid Id
|   1002: Not logged in
|   1003: No resource
|   1004: Permission Failure
|--------------------------------------------------
*/
router.delete('/:id', (req, res) => {
    //checks memo id validity
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "Invalid memo id",
            code: 1001,
        })
    }

    //checks login status
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: 'Not logged in',
            code: 1002,
        })
    }

    //find memo and check for writer
    Memo.findById(req.params.id, (err, memo) => {
        if(err) throw err

        if(!memo) {
            return res.status(404).json({
                error: 'Memo not found',
                code: 1003,
            })
        }
        if(memo.writer != req.session.loginInfo.username) {
            return res.status(403).json({
                error: 'No permission',
                code: 1004,
            })
        }

        Memo.remove({ _id: req.params.id }, err => {
            if(err) throw err
            res.json({ success: true })
        })
    })
})

/**
|--------------------------------------------------
| Read a memo: GET /api/memo
|--------------------------------------------------
*/
router.get('/', (req, res) => {
    Memo.find()
        .sort({"_id": -1})
        .limit(6)
        .exec((err, memos) => {
            if(err) throw err
            res.json(memos)
        })
})

/**
|--------------------------------------------------
| Read additional old/new memos: GET /api/memo/:listType/:id
|--------------------------------------------------
*/
router.get('/:listType/:id', (req, res) => {
    let listType = req.params.listType
    let id = req.params.id

    if(listType !== 'old' && listType !== 'new') {
        return res.status(400).json({
            error: 'INVALID LIST TYPE',
            code: 1001
        })
    }

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: 'INVALID ID',
            code: 1002
        })
    }

    let objectId = new mongoose.Types.ObjectId(req.params.id)

    if(listType === 'new') {
        //get newer memo
        Memo.find({ _id: { $gt: objectId }})
            .sort({ _id: -1 })
            .limit(6)
            .exec((err, memos) => {
                if(err) throw err
                return res.json(memos)
            })
    }
    else {
        //get older memo
        Memo.find({ _id: { $lt: objectId }})
            .sort({ _id: -1 })
            .limit(6)
            .exec((err, memos) => {
                if(err) throw err
                return res.json(memos)
            })
    }
})

/**
|--------------------------------------------------
| Toggles star of Memo: POST /api/memo/start/:id
| Error codes:
|   1001: INVALID ID
|   1002: NOT LOGGED IN
|   1003: NO RESOURCES
|--------------------------------------------------
*/
router.post('/star/:id', (req, res) => {
    //check memo id validity
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 1001
        })
    }

    //check login status
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: 'NOT LOGGED IN',
            code: 1002,
        })
    }

    //find memo
    Memo.findById(req.params.id, (err, memo) => {
        if(err) throw err

        //memo does not exists
        if(!memo) {
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 1003,
            })
        }

        //get index of username in the array
        let index = memo.starred.indexOf(req.session.loginInfo.username)

        //check if user already given star
        let hasStarred = (index === -1) ? false : true

        if(!hasStarred) {
            memo.starred.push(req.session.loginInfo.username)
        }
        else {
            memo.starred.splice(index, 1)
        }

        memo.save((err, memo) => {
            if(err) throw err
            res.json({
                success: true,
                'hasStarred': !hasStarred,
                memo
            })
        })
    })
})

export default router