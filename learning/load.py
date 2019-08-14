import os
from PIL import Image

class Load:
    def __init__(self, str_path):
        self.path_dir = str_path #가져올 파일들이 있는 directory path

    # filename을 추출하는 함수
    def load_filename(self):
        filename_list = os.listdir(self.path_dir)
        filename_list.remove('.DS_Store') # macOS
        print(filename_list) # debug log

        filename_list.sort() 

        return filename_list

    # directory에 있는 file(self.path_dir + filename_list)을 가져온다.
    def load_img(self, filename_list):
        print(filename_list)
        img_list = []
        
        for each in filename_list:
            img_obj = Image.open(self.path_dir+each)
            img_list.append(img_obj)
            
        img_list.sort()

        return img_list