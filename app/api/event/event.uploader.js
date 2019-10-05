const multer = require("multer");

exports.uploader = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb){
            cb(null, '../now_u_see_me_learning/fresh/');
        },
        filename: function (req, file, cb){
            cb(null, file.originalname);
        }
    })
});


