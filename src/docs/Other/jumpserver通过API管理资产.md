# jumpserver通过API管理资产
```
#!/usr/bin/env python3
# coding=UTF-8

import re
import requests
import json

jms_url = 'http://jumpserver-it.devops.************.com'
token = 'eec98f50113c040e054a9faeee4142e6a3a513cb'
# jms_url = "http://10.23.188.101"
# token = "H3pSTBYM4bsLw4sjapHp8R8CgynOqZwq4qmZ"

headers = {
    "Authorization": 'Token ' + token,
    'X-JMS-ORG': '40f384e6-18eb-4fad-9181-979088260a96'  # 如果你想操作其他组织，先获取到组织ID
    # 'X-JMS-ORG': '00000000-0000-0000-0000-000000000002', ###这是admin的组织

}


# 获取token
def get_token(username, password):
    url = jms_url + "/api/v1/authentication/auth/"
    query_args = {
        "username": username,
        "password": password
    }
    response = requests.post(url, data=query_args)
    return json.loads(response.text)["token"]


# 查看资产节点信息
def get_node_info(node_name):
    url = jms_url + "/api/v1/assets/nodes/"
    resp = requests.get(url, headers=headers, params={
        "value": node_name
    })
    return resp.json()


# 查看资产节点信息
def get_node_all():
    url = jms_url + "/api/v1/assets/nodes/"
    resp = requests.get(url, headers=headers)
    return resp.json()


# 创建资产节点
def assets_nodes_create(node_name):
    node_data = {
        "value": node_name
    }

    url = jms_url + "/api/v1/assets/nodes/"

    node_info = get_node_info(node_name)
    if node_info:
        print("{name}已存在, id: {id}".format(name=node_name, id=node_info[0]["id"]))
    else:
        data = json.dumps(node_data)
        resp = requests.post(url, headers=headers, data=data)
        # print (json.loads(resp.text))
        return json.loads(resp.text)["id"]


# 查ip资产
def get_assets_list_by_ip(ip):
    url = jms_url + "/api/v1/assets/assets/"
    resp = requests.get(url, headers=headers, params={
        "ip": ip
    })
    return resp.json()


def get_admin_userid(admin_user):
    url = jms_url + "/api/v1/assets/admin-users/"
    resp = requests.get(url, headers=headers)
    for i in json.loads(resp.text):
        if i['name'] == admin_user:
            return i['id']
    print(resp.json())
    # return resp.json()[0]['id']


# 添加资产
def asset_create(ip, hostname, admin_id, node_id, comment):
    asset_Data = {
        "ip": ip,
        "hostname": hostname,
        "platform": "Linux",
        "protocol": "ssh",
        "port": 22,
        "is_active": True,
        "admin_user": admin_id,
        "nodes": [
            node_id
        ],
        "comment": comment
    }
    url = jms_url + "/api/v1/assets/assets/"
    data = json.dumps(asset_Data)
    resp = requests.post(url, headers=headers, data=data)
    print(json.loads(resp.text))


# 运行创建服务器资产
def run_create_assets(node_name, project_name, ip, comment):
    # 节点id，无节点时创建节点
    node_info = get_node_info(node_name)
    if len(node_info) == 0:
        node_id = assets_nodes_create(node_name)
    else:
        node_id = node_info[0]["id"]

    # 管理用户 id
    admin_id = get_admin_userid("tian")
    hostname = "{ip}_{project_name}".format(ip=ip, project_name=project_name)

    # 查IP,创建资产
    ip_info = get_assets_list_by_ip(ip)
    if ip_info:
        print("%s 已存在，nodes: %s" % (ip_info[0]["ip"], ip_info[0]["nodes"]))
    else:
        asset_create(ip, hostname, admin_id, node_id, comment)


# 从文件导入资产
def import_assets_from_file(file_name, node_name, project_name):
    result = read_ip_txt(file_name)
    for line in result:
        ips = line.strip().split()
        # print (len(ips))
        if len(ips) == 1:
            ip = ips[0]
            comment = ""
        elif len(ips) == 0:
            print("null line")
        else:
            ip = ips[0]
            comment = ips[1]
        run_create_assets(node_name, project_name, ip, comment)


def read_ip_txt(filename):
    result = []
    f = open(filename, "r")
    try:
        for line in f:
            if line not in result:
                result.append(line.strip())
    finally:
        f.close()
    return result


# 获取用户组信息
def get_groups_info_by_group_name(group_name):
    url = jms_url + "/api/v1/users/groups/"
    resp = requests.get(url, headers=headers, params={
        "name": group_name
    })
    # print (resp.json())
    return resp.json()


# 创建用户组
def users_groups_create(group_name):
    group_data = {
        "name": group_name,
        "comment": group_name
    }
    url = jms_url + "/api/v1/users/groups/"

    group_info = get_groups_info_by_group_name(group_name)
    if group_info:
        print("%s 已存在，id: %s" % (group_info[0]["name"], group_info[0]["id"]))
        return
    else:
        data = json.dumps(group_data)
        resp = requests.post(url, headers=headers, data=data)
        # print (json.loads(resp.text)["id"])
        return json.loads(resp.text)["id"]


# 查找用户信息
def get_user_info_by_username(username):
    url = jms_url + "/api/v1/users/users/"
    resp = requests.get(url, headers=headers, params={
        "username": username
    })
    print(resp.json())
    return resp.json()


# 创建用户
def users_users_create(project_name, user_name, email, phone, group_name, comment, system_roles, public_key):
    user_group_name = user_name + "_" + project_name
    password = user_name + "_R@z6wskC"
    url = jms_url + "/api/v1/users/users/"

    # 判断用户组是否创建
    group_info = get_groups_info_by_group_name(group_name)
    if len(group_info):
        group_id = group_info[0]["id"]
    else:
        group_id = users_groups_create(group_name)

    # 用户数据
    user_data = {
        "name": user_group_name,
        "username": user_name,
        "password": password,
        "email": email,
        "public_key": public_key,
        "groups": [
            group_id
        ],
        "role": "User",
        "phone": phone,
        "mfa_level": 1,
        "is_active": True,
        "date_expired": "2090-12-12 15:22:00 +0800",
        "comment": comment,
        "system_roles": [
            system_roles
        ],
    }

    # 查找用户信息
    user_info = get_user_info_by_username(user_name)
    if user_info:
        print("用户%s 已存在, id\t%s" % (user_info[0]["username"], user_info[0]["id"]))
    else:
        data = json.dumps(user_data)
        resp = requests.post(url, headers=headers, data=data)
        print(json.loads(resp.text))


# 从文件导入用户信息
def import_users_from_file(file_name, project_name):
    # 登录windows系统单独分组
    if re.match(r".*?_windows", project_name):
        user_group_name = project_name
        project_name = project_name.strip("_windows")
    else:
        user_group_name = project_name + "_cp"

    user_infos = read_ip_txt(file_name)

    for line in user_infos:
        user = line.strip().split(",")
        size = len(user)

        if size >= 3:
            if size == 4:
                comment = user[3]
            else:
                comment = ""
            if size == 5:
                public_key = user[4]
            else:
                public_key = ""

            users_users_create(project_name, user[0], user[1], user[2], user_group_name, comment, public_key)


# 更新用户信息
def users_users_update(id, name, user_name, email, public_key):
    url = jms_url + "/api/v1/users/users/"
    # 用户数据
    user_data = [{
        "id": id,
        "name": name,
        "username": user_name,
        "email": email,
        "public_key": public_key
    }]
    data = json.dumps(user_data)
    resp = requests.put(url, headers=headers, data=data)
    print(json.loads(resp.text))


# 从文件更新用户公钥
def update_users_from_file(file_name):
    user_infos = read_ip_txt(file_name)
    for line in user_infos:
        user = line.strip().split(",")
        size = len(user)
        print(size)
        if size >= 2:
            user_name = user[0]
            public_key = user[1]

            user_info = get_user_info_by_username(user_name)
            if user_info:
                id = user_info[0]["id"]
                name = user_info[0]["name"]
                email = user_info[0]["email"]
                users_users_update(id, name, user_name, email, public_key)
            else:
                print("%s 不存在，不能更新!" % user_name)
        else:
            print("文件格式：username,public_key")


# 修改机器 hostname
def asset_modif_hostname(ip, new_hostname):
    # 查IP id
    ip_info = get_assets_list_by_ip(ip)
    if ip_info:
        id = ip_info[0]["id"]

        url = jms_url + "/api/v1/assets/assets/"
        asset_data = [{
            "id": id,
            "ip": ip,
            "hostname": new_hostname,
            "platform": "Linux"
        }]
        data = json.dumps(asset_data)
        resp = requests.put(url, headers=headers, data=data)
        print(resp.text)
    else:
        print("%s不存在" % ip)

```

