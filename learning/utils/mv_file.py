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
import shutil
import load_img
import os

src_path = '../../fresh_img/'
dir_path = ''
dir_path1 = '../../unknown_img/'
dir_path2 = ''

obj_dirImg = load_img.DirImage() # fresh_img에 있는 filname 가져오는 객체 선언

filename_list = obj_dirImg.load_filename() # fresh_img에 filname 가져오기
dir_path2 = filename_list[0] # 그중 첫번째를 path2에 저장
dir_path = dir_path1 + dir_path2+'/' # ./unknown/{eventTime}으로 path 지정

# 그럴리 없겠지만 아무것도 없는거 가져오는지 확인
if len(filename_list) != 0:
    # 디렉터리 없는지 체크하고 만들어주기
    if not os.path.isdir(dir_path):
        os.mkdir(dir_path)
    # 파일 이동하기 src에서 dir로 
    for each in filename_list:
        shutil.move(src_path+each, dir_path+each)
