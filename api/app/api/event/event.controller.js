const models = require('../../models/models');
// const fcm = require('./event.fcm');
var FCM = require('fcm-node');

var serverKey = 'AAAAUPlFQ-I:APA91bGISszRb6F6tFSKCM6qkP_hDlDVhUBdCIMiKED5wtsNI06pt28RxYnn78igZwld5Zf6fz5e3eDMPCyn8uvyNIlyOJKc2KFd3APE84p9c52cxLK9x-p84iW7bkY1m2ON8r9ijWKC';
var fcm = new FCM(serverKey);

exports.send = (req, res) => {
    console.log("send");

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
// learning에서 unknown이미지가 오고
// notification 알람을 준다.
exports.unknown = (req, res) => {
    // console.log(req);
    let eventTime = req.body.eventTime; // event time
    let types = req.body.types; // unknown, friends, family
    let img_addrs = req.body.img_addrs; // image address

    console.log(eventTime);
    console.log(types);
    console.log(img_addrs);

    str_types = '';
    str_addrs = '';

    for(i = 0; i<img_addrs.length; i++){
        if( i != img_addrs.length - 1){
            str_types += types[i]+',';
            str_addrs += "../unknown_img/"+eventTime+img_addrs[i]+',';
        }else{
            str_types += types[i];
            str_addrs += "../unknown_img/"+eventTime+img_addrs[i]
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

            //fcm
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
                // app에게 전달할 데이터 notification identity를 보내줘야 함
                data: {
                    num1: eventTime
                }
            };
        }).catch(function(err){
            return res.status(404).json({err:'Undefined error!'});
        });
    }
}

// 모바일에서 선택한 사진 type update
// 
exports.update = (req, res) => {
    let eventTime = req.body.eventTime; // event time
    let types = req.body.types; // unknown, friends, family
    let img_addrs = req.body.img_addrs; // image address

    console.log(eventTime);
    console.log(types);
    console.log(img_addrs);

    str_types = '';
    str_addrs = '';

    for(i = 0; i<img_addrs.length; i++){
        if( i != img_addrs.length - 1){
            str_types += types[i]+',';
            str_addrs += "../unknown_img/"+eventTime+img_addrs[i]+',';
        }else{
            str_types += types[i];
            str_addrs += "../unknown_img/"+eventTime+img_addrs[i]
        }
    }

    if(eventTime == null){
        res.status(404).json({error: 'eventTime is null!'});
    }else{
        models.Event.update(
            {
                types: str_types,
                img_addrs: str_addrs
            },
            {where: {eventTime: eventTime}, returning: true}
        ).then(function(result){
            // db update 완료 하면
            
            res.status(201).json({res: 'update success from unknown img'});
            // res.json(result[1][0]);
        }).catch(function(err){
            return res.status(404).json({err:'model update error!'});
        });

        
    }

}

exports.token = (req, res) => {
    // console.log('token');
    console.log(req.body.data);

    var client_token = req.body.data;
    if(client_token == null){
        res.status(404).json({error: 'Token post error!'});
    }else{
        res.status(201).json({res: 'Token post success!'});
        
        // test용
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
}

//delete는 mobile쪽에서 yes 와 no를 선택하냐에 따라서 다르게 동작함
exports.delete = (req, res) => {

}

exports.test = (req, res) => {
    console.log('test get');
}
