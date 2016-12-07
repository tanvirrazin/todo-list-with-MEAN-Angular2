var express = require('express'),
    router = express.Router(),
    mongojs = require('mongojs'),
    db = mongojs('mongodb://localhost:27017/tasklist_scratch', ['tasks']);

router.get('/tasks', function(req, res, next) {
    db.tasks.find(function(err, tasks) {
        if(err) {
            res.send(err);
        } else {
            res.json(tasks);
        }
    });
});

// Get Single Task
router.get('/task/:id', function(req, res, next) {
    db.tasks.findOne({
        _id: mongojs.ObjectId(req.params.id)
    }, function(err, task) {
        if(err) {
            res.json(err);
        } else {
            res.json(task);
        }
    });
});

router.post('/tasks', function(req, res, next) {
    var task = req.body;
    if(!task.title || task.isDone) {
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.tasks.save(task, function(err, task) {
            res.json(task);
        });
    }
});

router.delete('/task/:id', function(req, res, next) {
    var taskId = req.params.id;
    db.tasks.remove({
        _id: mongojs.ObjectId(taskId)
    }, function(err, task) {
        if(err) {
            res.send(err);
        }
        res.json(task);
    });
});

// Update Task
router.put('/task/:id', function(req, res, next) {
    var task = req.body;
    var updTask = {};

    if(task.isDone) {
        updTask.isDone = task.isDone;
    }

    if(task.title) {
        updTask.title = task.title;
    }

    if(!updTask) {
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.tasks.update({
            _id: mongojs.ObjectId(req.params.id)
        }, updTask, {}, function(err, task) {
            if(err) {
                res.json(err);
            }
            res.json(task);
        });
    }
});

module.exports = router;
