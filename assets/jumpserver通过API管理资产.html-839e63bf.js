import{_ as e,W as n,X as i,a0 as s}from"./framework-b4edc447.js";const d={},l=s(`<h1 id="jumpserver通过api管理资产" tabindex="-1"><a class="header-anchor" href="#jumpserver通过api管理资产" aria-hidden="true">#</a> jumpserver通过API管理资产</h1><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>#!/usr/bin/env python3
# coding=UTF-8

import re
import requests
import json

jms_url = &#39;http://jumpserver-it.devops.************.com&#39;
token = &#39;eec98f50113c040e054a9faeee4142e6a3a513cb&#39;
# jms_url = &quot;http://10.23.188.101&quot;
# token = &quot;H3pSTBYM4bsLw4sjapHp8R8CgynOqZwq4qmZ&quot;

headers = {
    &quot;Authorization&quot;: &#39;Token &#39; + token,
    &#39;X-JMS-ORG&#39;: &#39;40f384e6-18eb-4fad-9181-979088260a96&#39;  # 如果你想操作其他组织，先获取到组织ID
    # &#39;X-JMS-ORG&#39;: &#39;00000000-0000-0000-0000-000000000002&#39;, ###这是admin的组织

}


# 获取token
def get_token(username, password):
    url = jms_url + &quot;/api/v1/authentication/auth/&quot;
    query_args = {
        &quot;username&quot;: username,
        &quot;password&quot;: password
    }
    response = requests.post(url, data=query_args)
    return json.loads(response.text)[&quot;token&quot;]


# 查看资产节点信息
def get_node_info(node_name):
    url = jms_url + &quot;/api/v1/assets/nodes/&quot;
    resp = requests.get(url, headers=headers, params={
        &quot;value&quot;: node_name
    })
    return resp.json()


# 查看资产节点信息
def get_node_all():
    url = jms_url + &quot;/api/v1/assets/nodes/&quot;
    resp = requests.get(url, headers=headers)
    return resp.json()


# 创建资产节点
def assets_nodes_create(node_name):
    node_data = {
        &quot;value&quot;: node_name
    }

    url = jms_url + &quot;/api/v1/assets/nodes/&quot;

    node_info = get_node_info(node_name)
    if node_info:
        print(&quot;{name}已存在, id: {id}&quot;.format(name=node_name, id=node_info[0][&quot;id&quot;]))
    else:
        data = json.dumps(node_data)
        resp = requests.post(url, headers=headers, data=data)
        # print (json.loads(resp.text))
        return json.loads(resp.text)[&quot;id&quot;]


# 查ip资产
def get_assets_list_by_ip(ip):
    url = jms_url + &quot;/api/v1/assets/assets/&quot;
    resp = requests.get(url, headers=headers, params={
        &quot;ip&quot;: ip
    })
    return resp.json()


def get_admin_userid(admin_user):
    url = jms_url + &quot;/api/v1/assets/admin-users/&quot;
    resp = requests.get(url, headers=headers)
    for i in json.loads(resp.text):
        if i[&#39;name&#39;] == admin_user:
            return i[&#39;id&#39;]
    print(resp.json())
    # return resp.json()[0][&#39;id&#39;]


# 添加资产
def asset_create(ip, hostname, admin_id, node_id, comment):
    asset_Data = {
        &quot;ip&quot;: ip,
        &quot;hostname&quot;: hostname,
        &quot;platform&quot;: &quot;Linux&quot;,
        &quot;protocol&quot;: &quot;ssh&quot;,
        &quot;port&quot;: 22,
        &quot;is_active&quot;: True,
        &quot;admin_user&quot;: admin_id,
        &quot;nodes&quot;: [
            node_id
        ],
        &quot;comment&quot;: comment
    }
    url = jms_url + &quot;/api/v1/assets/assets/&quot;
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
        node_id = node_info[0][&quot;id&quot;]

    # 管理用户 id
    admin_id = get_admin_userid(&quot;tian&quot;)
    hostname = &quot;{ip}_{project_name}&quot;.format(ip=ip, project_name=project_name)

    # 查IP,创建资产
    ip_info = get_assets_list_by_ip(ip)
    if ip_info:
        print(&quot;%s 已存在，nodes: %s&quot; % (ip_info[0][&quot;ip&quot;], ip_info[0][&quot;nodes&quot;]))
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
            comment = &quot;&quot;
        elif len(ips) == 0:
            print(&quot;null line&quot;)
        else:
            ip = ips[0]
            comment = ips[1]
        run_create_assets(node_name, project_name, ip, comment)


def read_ip_txt(filename):
    result = []
    f = open(filename, &quot;r&quot;)
    try:
        for line in f:
            if line not in result:
                result.append(line.strip())
    finally:
        f.close()
    return result


# 获取用户组信息
def get_groups_info_by_group_name(group_name):
    url = jms_url + &quot;/api/v1/users/groups/&quot;
    resp = requests.get(url, headers=headers, params={
        &quot;name&quot;: group_name
    })
    # print (resp.json())
    return resp.json()


# 创建用户组
def users_groups_create(group_name):
    group_data = {
        &quot;name&quot;: group_name,
        &quot;comment&quot;: group_name
    }
    url = jms_url + &quot;/api/v1/users/groups/&quot;

    group_info = get_groups_info_by_group_name(group_name)
    if group_info:
        print(&quot;%s 已存在，id: %s&quot; % (group_info[0][&quot;name&quot;], group_info[0][&quot;id&quot;]))
        return
    else:
        data = json.dumps(group_data)
        resp = requests.post(url, headers=headers, data=data)
        # print (json.loads(resp.text)[&quot;id&quot;])
        return json.loads(resp.text)[&quot;id&quot;]


# 查找用户信息
def get_user_info_by_username(username):
    url = jms_url + &quot;/api/v1/users/users/&quot;
    resp = requests.get(url, headers=headers, params={
        &quot;username&quot;: username
    })
    print(resp.json())
    return resp.json()


# 创建用户
def users_users_create(project_name, user_name, email, phone, group_name, comment, system_roles, public_key):
    user_group_name = user_name + &quot;_&quot; + project_name
    password = user_name + &quot;_R@z6wskC&quot;
    url = jms_url + &quot;/api/v1/users/users/&quot;

    # 判断用户组是否创建
    group_info = get_groups_info_by_group_name(group_name)
    if len(group_info):
        group_id = group_info[0][&quot;id&quot;]
    else:
        group_id = users_groups_create(group_name)

    # 用户数据
    user_data = {
        &quot;name&quot;: user_group_name,
        &quot;username&quot;: user_name,
        &quot;password&quot;: password,
        &quot;email&quot;: email,
        &quot;public_key&quot;: public_key,
        &quot;groups&quot;: [
            group_id
        ],
        &quot;role&quot;: &quot;User&quot;,
        &quot;phone&quot;: phone,
        &quot;mfa_level&quot;: 1,
        &quot;is_active&quot;: True,
        &quot;date_expired&quot;: &quot;2090-12-12 15:22:00 +0800&quot;,
        &quot;comment&quot;: comment,
        &quot;system_roles&quot;: [
            system_roles
        ],
    }

    # 查找用户信息
    user_info = get_user_info_by_username(user_name)
    if user_info:
        print(&quot;用户%s 已存在, id\\t%s&quot; % (user_info[0][&quot;username&quot;], user_info[0][&quot;id&quot;]))
    else:
        data = json.dumps(user_data)
        resp = requests.post(url, headers=headers, data=data)
        print(json.loads(resp.text))


# 从文件导入用户信息
def import_users_from_file(file_name, project_name):
    # 登录windows系统单独分组
    if re.match(r&quot;.*?_windows&quot;, project_name):
        user_group_name = project_name
        project_name = project_name.strip(&quot;_windows&quot;)
    else:
        user_group_name = project_name + &quot;_cp&quot;

    user_infos = read_ip_txt(file_name)

    for line in user_infos:
        user = line.strip().split(&quot;,&quot;)
        size = len(user)

        if size &gt;= 3:
            if size == 4:
                comment = user[3]
            else:
                comment = &quot;&quot;
            if size == 5:
                public_key = user[4]
            else:
                public_key = &quot;&quot;

            users_users_create(project_name, user[0], user[1], user[2], user_group_name, comment, public_key)


# 更新用户信息
def users_users_update(id, name, user_name, email, public_key):
    url = jms_url + &quot;/api/v1/users/users/&quot;
    # 用户数据
    user_data = [{
        &quot;id&quot;: id,
        &quot;name&quot;: name,
        &quot;username&quot;: user_name,
        &quot;email&quot;: email,
        &quot;public_key&quot;: public_key
    }]
    data = json.dumps(user_data)
    resp = requests.put(url, headers=headers, data=data)
    print(json.loads(resp.text))


# 从文件更新用户公钥
def update_users_from_file(file_name):
    user_infos = read_ip_txt(file_name)
    for line in user_infos:
        user = line.strip().split(&quot;,&quot;)
        size = len(user)
        print(size)
        if size &gt;= 2:
            user_name = user[0]
            public_key = user[1]

            user_info = get_user_info_by_username(user_name)
            if user_info:
                id = user_info[0][&quot;id&quot;]
                name = user_info[0][&quot;name&quot;]
                email = user_info[0][&quot;email&quot;]
                users_users_update(id, name, user_name, email, public_key)
            else:
                print(&quot;%s 不存在，不能更新!&quot; % user_name)
        else:
            print(&quot;文件格式：username,public_key&quot;)


# 修改机器 hostname
def asset_modif_hostname(ip, new_hostname):
    # 查IP id
    ip_info = get_assets_list_by_ip(ip)
    if ip_info:
        id = ip_info[0][&quot;id&quot;]

        url = jms_url + &quot;/api/v1/assets/assets/&quot;
        asset_data = [{
            &quot;id&quot;: id,
            &quot;ip&quot;: ip,
            &quot;hostname&quot;: new_hostname,
            &quot;platform&quot;: &quot;Linux&quot;
        }]
        data = json.dumps(asset_data)
        resp = requests.put(url, headers=headers, data=data)
        print(resp.text)
    else:
        print(&quot;%s不存在&quot; % ip)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),u=[l];function r(v,a){return n(),i("div",null,u)}const t=e(d,[["render",r],["__file","jumpserver通过API管理资产.html.vue"]]);export{t as default};
