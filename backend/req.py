import urllib.request
import urllib.error
import json

url = "http://127.0.0.1:8000/api/projects/fc37a7c7-b153-4e48-ae06-42d31d59d3c9/run-phase/functional_decomposition"
req = urllib.request.Request(url, method="POST", headers={"Authorization": "Bearer YOUR_REAL_JWT_HERE"})

try:
    with urllib.request.urlopen(req) as response:
        print("Status 200 OK")
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(e)
