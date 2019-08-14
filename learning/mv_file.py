# 만약 모델에서 결과가 false이면(우리집 사람이 아니라면)
# ./unknown/{eventTimeA} dictionary 생성 후
# fresh_img에 있는 image파일들 이동
# 그리고 이동된 ./unknown/{eventTimeA}에 있는 파일들 post요청
# eventTime = filenmelist[0]
# type = 1
# img0_addr = ./unknown_img/{filenamelist[0]}/filenamelist[0] (또는 ../../unknown_img/{filenamelist[0]/filenamelist[0]})
# img1_addr = ./unknown_img/{filenamelist[0]}/filenamelist[1]
# ...
# ...
# 연산 후 결과가 true이면(우리집 사람이라면) 어케함?
# 결과가 true이면 storage에 있는 데이터 삭제 후 
# 서버에 db에 있는 내용 삭제하라고 알려줌

import shutil
import os

# pram: 이동시킬 파일 리스트, 출발지, 이동시킬 목적지
def mv_file(filename_list, src_path, des_path):
    # 디렉터리 없는지 체크하고 만들어주기
    if not os.path.isdir(des_path):
        os.mkdir(des_path)
    # 파일 이동하기 src에서 dir로 
    for each in filename_list:
        shutil.move(src_path+each, des_path+each)
