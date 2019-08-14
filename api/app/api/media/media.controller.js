const models = require('../../models/models');

exports.create = (req, res) => {
    console.log("create");

    let files = req.files;

    // 필요한것만 빼서 스기
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

        models.Media.create({
            eventTime: img_addrs[0],
            type0: 0,
            type1: 0,
            type2: 0,
            type3: 0,
            type4: 0,
            type5: 0,
            img0_addr: "../../fresh_img/"+img_addrs[0],
            img1_addr: "../../fresh_img/"+img_addrs[1],
            img2_addr: "../../fresh_img/"+img_addrs[2],
            img3_addr: "../../fresh_img/"+img_addrs[3],
            img4_addr: "../../fresh_img/"+img_addrs[4],
            img5_addr: "../../fresh_img/"+img_addrs[5]
        }).then((media) => res.status(201).json(media));
    }
}

exports.update = (req, res) => {
    console.log(req.body.eventTime);
    eventTime = req.body.eventTime;
    types = req.body.types;
    img_addrs = req.body.img_addrs;

    if(eventTime == null){
        res.status(404).json({error: 'eventTime is null!'});
    }else{
        // Media table안에 
        // type들을 req.types[i]에 맞게 바꿔줌
        // img_addr의 위치도 req.img_addrs[i]에 맞게 바꿔줌
        // where? -> eventTime 이름이 일치하는 테이블
        models.Media.update(
            {
                type0: types[0],
                type1: types[1],
                type2: types[2],
                type3: types[3],
                type4: types[4],
                type5: types[5],
                img0_addr: img_addrs[0],
                img1_addr: img_addrs[1],
                img2_addr: img_addrs[2],
                img3_addr: img_addrs[3],
                img4_addr: img_addrs[4],
                img5_addr: img_addrs[5]
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
