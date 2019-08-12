const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

const controller = require('./media.controller');

const multer = require('multer');

//1. event에 대한 image 들을 받는다.
//2. storage에 data 저장 
//3. db에 path, type = fresh, eventname(time) 저장
//post 요청

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb){
            cb(null, '../../fresh_img/');
        },
        filename: function (req, file, cb){
            cb(null, file.originalname);
        }
    })
});

router.post('/capture', upload.array('file', 8, controller.new_media));