const models = require('../../models/models');
// const fcm = require('./event.fcm');
var FCM = require('fcm-node');
var fs = require('fs');

var serverKey = 'AAAAUPlFQ-I:APA91bGISszRb6F6tFSKCM6qkP_hDlDVhUBdCIMiKED5wtsNI06pt28RxYnn78igZwld5Zf6fz5e3eDMPCyn8uvyNIlyOJKc2KFd3APE84p9c52cxLK9x-p84iW7bkY1m2ON8r9ijWKC';
var fcm = new FCM(serverKey);
var client_token;

// CAM에서 찍은 사용자 image를 보낼때 호출된다.
exports.upload = (req, res) => {
    console.log("/event/upload");
    let files = req.files;
    
    if(files == null){
        res.status(404).json({error: 'File not transfer!'});
    }
    
    // 1. image file의 이름을 오름차순으로 정렬해서 mg_addrs에 저장.
    let img_addrs = [];
    files.forEach(element => {
        img_addrs.push(element['originalname']);
    });
    img_addrs.sort();

    // 2. event 이름(eventTime), image 저장 경로를 DB에 event Table을 만들어 저장한다.
    var str_types = '';
    var str_addrs = '';

    for(i = 0; i<img_addrs.length; i++){
        if( i != img_addrs.length - 1){
            str_types += '0,';
            str_addrs += "../fresh_img/"+img_addrs[i]+',';
        }else{
            str_types += '0';
            str_addrs += "../fresh_img/"+img_addrs[i]
        }
    }

    models.Event.create({
        eventTime: img_addrs[0] - ".jpg",
        types: str_types,
        img_addrs: str_addrs
    })
    // 성공했다면 201 응답
    .then(function(event){
        return res.status(201).json({res: 'success: create tbale '+img_addrs[0]})
    })
    // 실패라면 404 응답
    .catch(function(err){
        return res.status(404).json({err:'error: Do not create table '+img_addrs[0]});
    });
}

// learning에서 unknown이 검출되면 호출된다.
exports.unknown = (req, res) => {
    console.log("event/unknown")

    // {
    //  eventTime: string, 
    //  types: string,
    //  img_addrs: [string, string]
    // }

    let eventTime = req.body.eventTime; // event time
    let types = req.body.types; // unknown, friends, family
    let img_addrs = req.body.img_addrs; // image address

    var str_types = '';
    var str_addrs = '';

    // 1. type과 img_addr를 table 형식에 맡게 바꿔준다.
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
        return res.status(404).json({err: 'eventTime is null!'});
    }

    // 2. eventTime을 이용해 table을 찾고 types와 img_addrs를 update 해준다.
    models.Event.update(
        {
            types: str_types,
            img_addrs: str_addrs
        },
        {where: {eventTime: eventTime}, returning: true}
    ).then(function(event){
        // res.json(result[1][0]);

        // 3. update 성공이면 notification 보낼 자료구조(push_data)를 만든다.
        var push_data = {
            to: client_token,
            // app이 실행중이지 않을 때 상태바 알림으로 등록할 내용
            notification: {
                title: "Warnning",
                body: "An unknown person broke into our house!",
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
                eventTime: eventTime
            }
        };
        // 4. fcm을 이용해 notification을 보낸다.
        fcm.send(push_data, function(err, response){
            if(err){
                console.error("Failed notification!");
                return res.status(404).json({err: "Failed notification!"});
            }else{
                console.log('Success notification');
                return res.status(201).json({res: "Success notification"});
            }
        });

    })
    // 만약 db에 update하는 것이 실패한다면
    .catch(function(err){
        return res.status(404).json({err:'error: Do not update table '+eventTime});
    });

    res.status(201).json({res: 'Successfully sent notification and update table '+eventTime});
}

// 모바일에서 fcm을 보낼 때 호출
exports.token = (req, res) => {
    console.log('/event/token');

    client_token = req.body.token;
    if(client_token == null){
        return res.status(404).json({err: 'Token post error!'}); 
    }
    
    // token 받았으면 db에 저장
    // but 지금은 어플에서 계속 새로 생성하고 있으니 상관 없음
    res.status(201).json({res: 'Token post success!'});
}

// 모바일에서 unknown event에 대한 image요청할 때 호출
exports.images = (req, res) => {
    console.log("/event/images/: "+req.params.eventTime);

    // 1. 모바일에서 보낸 eventTime 받기
    let eventTime = req.params.eventTime;

    if(eventTime = null){
        return res.status(404).json({err: 'eventTime is null! check for URL(/event/images/:eventTime)'});
    }
    // 2. eventTime을 이용해 해당 table 검출
    models.Event.findOne({
        where: {
            eventTime: eventTime
        }
    }).then(function(event){
        // 3. 검출된 table(event)에서 img_addrs를 img_addrs에 저장
        var img_addrs = event.img_addrs // event table의 image address
        // 4. img_addrs에 , 기준으로 img_addrs를 split해서 list형태로 저장
        img_addrs = img_addrs.split(','); // comma 기준으로 자른다.

        // 5. fs와 img_addrs를 이용해 local storage의 image를 images 변수에 저장한다.
        var images = []; // 보낼 이미지가 담겨있는 변수

        for(i = 0; i<img_addrs.length; i++){
            fs.readFile(img_addrs[i], function(image){
                images.push(image);
            });
        }
        
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.write(images);
        res.end();
        // return res.status(201).json({success: 'GET success!, /event/images'});
    }).catch(function(err){
        return res.status(404).json({err: 'No such incoreect table: '+eventTime});
    })
    res.status(201).json({res: eventTime});
    
}

// 모바일에서 선택한 사진 type update
exports.update = (req, res) => {
    console.log("event/update");

    // 1. 사용자(모바일)에게 받은 제대로된 type을 받는다.
    let eventTime = req.body.eventTime; // event time
    let types = req.body.types; // unknown, friends, family
    let img_addrs = req.body.img_addrs; // image address

    // console.log(eventTime);
    // console.log(types);
    // console.log(img_addrs);

    // 2. 받은 데이터를 table형식으로 맞춰준다.
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
    }
    // 3. eventTime을 이용해 types, img_addrs를 update해준다.
    models.Event.update(
        {
            types: str_types,
            img_addrs: str_addrs
        },
        {where: {eventTime: eventTime}, returning: true}
    ).then(function(event){
        var img_addrs =event.img_addrs;
        var types = event.types;

        // 4. img_addrs의 idx와 types의 idx는 서로 1:1 대응된다.
        // 따라서 types[i]가 1이면 family, 2이면 friends으로 분류하고
        // 그에 맞는 directory에 파일을 이동시켜 준다.
        for(i=0; i<img_addrs.length; i++){
            if(types[i] == '1'){ // family
                let new_path = '../family/'+eventTime;
                fs.rename(img_addrs[i], new_path, function(err){
                    if(err){
                        console.log("Family 이동 실패");
                        return res.status(404).json({err: 'Failed to move '+img_addrs[i]+'to fmaily directory'});
                    }else{
                        // 5. 그리고 제대로 이동이 되었다면 eventTime: req.body.eventTime을 받는 table은 삭제해준다.
                        console.log("Family 이동 성공");
                        // res.json({res: 'Failed to move '+img_addrs[i]+'to fmaily directory'});
                    }
                })
            }else if(types[i] == '2'){ // friends
                let new_path = '../friends/'+eventTime;
                fs.rename(img_addrs[i], new_path, function(err){
                    if(err){
                        console.log("Friends 이동 실패");
                        return res.status(404).json({err: 'Failed to move '+img_addrs[i]+'to friends directory'});
                    }else{
                        console.log("Friends 이동 성공");
                    }
                })
            }
        }
    }).catch(function(err){
        return res.status(404).json({err:'No such incoreect table:  '+eventTime});
    });

    res.status(201).json({res: eventTime});

}