const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

const controller = require('./event.controller');
const uploader = require('./event.uploader');

//url 예시
//http://13.125.83.183:8080/storytour_test/api/1/user/attr/restaurant/dozens/37.5841312339/126.9821869/1/1

//1. event에 대한 image 들을 받는다.
//2. storage에 data 저장 
//3. db에 path, type = fresh, eventname(time) 저장 
//post 요청
router.post('/send', uploader.uploader.array('file', 8), controller.create);

/**************************************************** */
//만약 받은 내용이 unknown이라면(learning 에서 unknown이라면)
//1. {eventTime}, {path}, type = unknown 을 받는다.
//2. db에 저장
// 각각의 data field는 이미 learning에서 판단되서 오는 값들임

//post 요청
// router.post('/update/:eventTime', controller.update);
router.post('/update', controller.update);

//모바일에서
//1. YES - C  선택 시 
//2. storage 의 {eventTime}에 대한 dictionary의 이름을 C로 변경
//3. {eventTime}의 table삭제
//delete 요청
router.delete('/delete/:user_name', controller.delete);

//모바일에서
//1. NO 선택 시
//2. db의 {eventTime} table삭제
router.delete('/delete', controller.delete);

module.exports = router;