import requests
import json

class ClientManager:
    def __init__(self):
        self.url = 'http://127.0.0.1:3000/media/'

    def post_status_update(self, json_result):
        url = self.url + 'update'
        res = requests.post(url, data = json_result)
        print(res)