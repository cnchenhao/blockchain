### 1. 注册
* 接口地址：/user/register
* 请求方式：POST
* 请求参数：
~~~
{
  "address":"TVjmtiAVdbox9LYtZ7eu8Bq7mHJFZCZ3dg",
  "name":"chenhao",
  "sign":"eff7d5dba32b4da32d9a67a519434d3f"
}
~~~
* 返回值：
~~~
{
  "code": 0,
  "message": "成功"
}
~~~

### 2. 登录
* 接口地址：/user/login
* 请求方式：POST
* 请求参数：
~~~
{
  "address":"TVjmtiAVdbox9LYtZ7eu8Bq7mHJFZCZ3dg",
  "sign":"ab56b4d92b40713acc5af89985d4b786"
}
~~~
* 成功返回值：
~~~
{
  "code": 0,
  "message": "成功",
  "data":{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjUsIkFkZHJlc3MiOiJhZHNmZHNmZHNmZHMxMWRmc2RzZmEiLCJpYXQiOjE1NDU0NTAwNTUsImV4cCI6MTU0NTUzNjQ1NX0.PwUqLko45qLQKIFCy6oC8CCODK1mug_xP4PKF8GjtUI","expires_in":1545536455,"token_type":"Bearer"}
}
~~~
* 失败返回值：
~~~
{
  "code":10001,
  "message":"未注册"
}
~~~

### 3. 市场列表


### 4. 我的列表


### 5. 获取Idol详情


### 6. 点赞


### 7. 取消点赞

