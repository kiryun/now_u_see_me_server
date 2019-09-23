const models = require('../../models/models');
// const fcm = require('./event.fcm');
var FCM = require('fcm-node');

var serverKey = 'AAAAUPlFQ-I:APA91bGISszRb6F6tFSKCM6qkP_hDlDVhUBdCIMiKED5wtsNI06pt28RxYnn78igZwld5Zf6fz5e3eDMPCyn8uvyNIlyOJKc2KFd3APE84p9c52cxLK9x-p84iW7bkY1m2ON8r9ijWKC';
var fcm = new FCM(serverKey);

exports.create = (req, res) => {
    console.log("create");

    let files = req.files;

    // 필요한것만 빼서 쓰기
    // let result = {
    //     originalName: files.originalname,
    //     size: files.size
    // };
    
    if(files == null){
        res.status(404).json({error: 'File not transfer!'});
    }else{
        // console.log(result); // undefined, why?
        // console.log(files);

        // {event_Time(first file name)}
        // {path(derectory location img0 ~ img6)}
        // {type} = fresh(0)

        // 비동기 방식의 언어에서 forEach 사용을 습관화 하자
        let img_addrs = [];
        files.forEach(element => {
            img_addrs.push(element['originalname']);
        });
        img_addrs.sort();

        str_types = '';
        str_addrs = '';
        for(i = 0; i<img_addrs.length; i++){
            if( i != img_addrs.length - 1){
                str_types += '0,';
                str_addrs += "../fresh_img/"+img_addrs[i]+',';
            }else{
                str_types += '0';
                str_addrs += "../fresh_img/"+img_addrs[i]
            }
        }
        // console.log(str_addrs);
        // console.log(str_types);

        models.Event.create({
            eventTime: img_addrs[0],
            types: str_types,
            img_addrs: str_addrs
        }).then((event) => res.status(201).json(event));
    }
}

// 이미지에 대한 정보를 
// update해준다.
// learning에서는 unknown이미지가 오고
// mobile에서는 사용자가 설정한 값이 들어온다.
// mobile쪽에서 올경우에는 local storage를 변경해서 learning에게 알려줘야 한다.
exports.update = (req, res) => {
    // console.log(req);
    eventTime = req.body.eventTime;
    types = req.body.types;
    img_addrs = req.body.img_addrs;
    console.log(eventTime);
    console.log(types);
    console.log(img_addrs);

    str_types = '';
    str_addrs = '';
    for(i = 0; i<img_addrs.length; i++){
        if( i != img_addrs.length - 1){
            str_types += types[i]+',';
            str_addrs += "../fresh_img/"+img_addrs[i]+',';
        }else{
            str_types += types[i];
            str_addrs += "../fresh_img/"+img_addrs[i]
        }
    }

    if(eventTime == null){
        res.status(404).json({error: 'eventTime is null!'});
    }else{
        // Media table안에 
        // type들을 req.types[i]에 맞게 바꿔줌
        // img_addr의 위치도 req.img_addrs[i]에 맞게 바꿔줌
        // where? -> eventTime 이름이 일치하는 테이블
        models.Event.update(
            {
                types: str_types,
                img_addrs: str_addrs
            },
            {where: {eventTime: eventTime}, returning: true}
        ).then(function(result){
            res.json(result[1][0]);
            //test fcm
            // fcm.push;
        }).catch(function(err){
            return res.status(404).json({err:'Undefined error!'});
        });
    }
}

exports.token = (req, res) => {
    console.log('token');
    // console.log(req);
    var client_token = req.data;
    if(client_token == null){
        res.status(404).json({error: 'Token post error!'});
    }else{
        res.status(201).json({res: 'Token post success!'});
        
        var push_data = {
            to: client_token,
            // app이 실행중이지 않을 때 상태바 알림으로 등록할 내용
            notification: {
                title: "Warnning",
                body: "check for this picture",
                sound: "default",
                client_token: "FCM_PLUGIN_ACTIVITY",
                icon: "fcm_push_icon"
            },
            // message 중요도
            priority: "high",
            // app package name
            restricted_package_name: "com.dev.kih.nusm",
            // app에게 전달할 데이터
            data: {
                num1: "notification from node.js"
                // num2: 3000
            }
        };

        fcm.send(push_data, function(err, response){
            if(err){
                console.error("Push 발송에 실패");
                console.error(err);
                return;
            }else{
                console.log('Push 성공');
            console.log(response);
            console.log(response.results);
            }
        });
    }
    
    //  토큰 받았으면
    // 1. db에 토큰 값 저장(덮어쓰기)
    // 2. notification 알림 보내기
    // 3. 모바일에서 post 요청
    // 4. ,,,
}
``
// unknown 이미지 보내주기
exports.unknown = (req, res) => {
    
}

//delete는 mobile쪽에서 yes 와 no를 선택하냐에 따라서 다르게 동작함
exports.delete = (req, res) => {

}

exports.test = (req, res) => {
    console.log('test get');
}
