# ./unknown 에 있는 
import requests
import json
import load_img

url = 'http://127.0.0.1:3000/media/update'

ojb_dirImg = load_img.DirImage()
filename_list = ojb_dirImg.load_filename()
filename_list.sort()
print(filename_list)

# eventTime
# file directory path/filename.png
data = {'eventTime': filename_list[0]}
print(data)

res = requests.post(url, data = data)
print(res)