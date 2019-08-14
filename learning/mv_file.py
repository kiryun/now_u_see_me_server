import shutil
import os

# pram: 이동시킬 파일 리스트, 출발지, 이동시킬 목적지
def mv_file(filename_list, src_path, des_path):
    list_des = []
    # 디렉터리 없는지 체크하고 만들어주기
    if not os.path.isdir(des_path):
        os.mkdir(des_path)
    # 파일 이동하기 src에서 dir로 
    for each in filename_list:
        shutil.move(src_path+each, des_path+each)
        list_des.append(des_path)
    # 최종 저장된 폴더경로 + 파일 이름 리턴
    return list_des
