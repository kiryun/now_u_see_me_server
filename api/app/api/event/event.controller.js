const models = require('../../models/models');

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
        }).catch(function(err){
            return res.status(404).json({err:'Undefined error!'});
        });
    }
}

//delete는 mobile쪽에서 yes 와 no를 선택하냐에 따라서 다르게 동작함
exports.delete = (req, res) => {

}
