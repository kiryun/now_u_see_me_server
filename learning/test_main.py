# 서버에 get요청으로 eventTime과 그 내용들 가져오기 (이거 이렇게 해도됨?, 가져오는 동안에 다시 fresh가 쌓일 경우는 없고?)
# ./fresh_img에서 image파일들 가져오기
# ./unknown/{eventTimeA} dictionary 생성 후
# fresh_img에 있는 image파일들 이동
# 그리고 딥러닝 함수에 확인 해보기 (load_img)

# 검사 대상 파일들을 json 형식으로 false(우리집 사람 아님) true(우리집 사람) 각각 태깅하기

# ./unknown/{eventTimeA}에 있는 파일들 post요청(create)
# eventTime = filenmelist[0]
# type0 = 1
# type1 = 2
# img0_addr = ./unknown_img/{filenamelist[0]}/filenamelist[0]
# img1_addr = ./unknown_img/{filenamelist[0]}/filenamelist[1]
# ...
# ...

# 연산 후 결과가 모두 true이면(전부 우리집 사람이라면)
# post요청 후 제대로 response 받으면 데이터 삭제

import load
import mv_file
import client_manager

import json

fresh_path = '../fresh_img/'
unknown_path = '' # unknown_path1 + unknown_path2
unknown_path1 = '../unknown_img/'
unknown_path2 = ''


if __name__ == "__main__":
    ld = load.Load(fresh_path)
    cm = client_manager.ClientManager()

    filename_list = ld.load_filename()
    img_list = ld.load_img(filename_list)

    unknown_path2 = filename_list[0]
    unknown_path = unknown_path1 + unknown_path2 + '/' # ./unknown/{eventTime}으로 path 지정

    # fresh_img에 있는 파일들 전부 unknown으로 이동 시키기
    list_des = [] # 옮겨진 파일 dir
    if len(filename_list) != 0:
        list_des = mv_file.mv_file(filename_list, fresh_path, unknown_path)
    print(list_des)

    ### deep learning function input ###
    print("deep learning function input")

    test_result = {
        'eventTime': '2019-07-09-10-010-01.jpg',
        'img_addrs': ['../unknown_img/2019-07-09-10-010-01.jpg/2019-07-09-10-010-04.jpg', 
        '../unknown_img/2019-07-09-10-010-01.jpg/2019-07-09-10-010-06.jpg'],
        'types': ['1', '1']
    }

    # json parsing
    json_result = json.dumps(test_result) # json 파싱하면 지금 안됨 왜그러지?
    # print(json_result)

    cm.post_status_update(test_result)




