const multer = require("multer");

exports.uploader = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb){
            cb(null, '../../fresh_img/');
        },
        filename: function (req, file, cb){
            cb(null, file.originalname);
        }
    })
});


