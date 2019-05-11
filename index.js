const express = require('express')
const {connection} = require('./config/database')
const app = express()
const {usersRouter} = require('./app/controllers/UsersController')
const {storiesRouter} = require('./app/controllers/StoriesController')
const {tagsRouter} = require('./app/controllers/TagsController')
const {topicsRouter} = require('./app/controllers/TopicsController')
const multer = require('multer')
const Path = require('path')
const port = 3030
const cors = require('cors')

app.use(cors())


app.use(express.json())


app.use('/users',usersRouter)
app.use('/stories', storiesRouter)
app.use('/topics', topicsRouter)
app.use('/tags', tagsRouter)

app.use('/publish/uploads', express.static('publish/uploads') )

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'publish/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + Path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage })
app.post('/upload', upload.single('previewImage'), function (req, res, next){
    console.log('/upload req.file-> ', req.file)
    if(req.file == undefined){
        res.status(401).send({msg: "attach an image to upload"})
    }else{
        res.send({
            msg: "Image uploaded successfully",
            path: `http://localhost:3030/${req.file.destination}/${req.file.filename}`
        })
    }
})

app.listen(port, function(){
    console.log('listening on port :',port)
})
