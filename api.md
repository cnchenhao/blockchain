### 1. 注册
* 接口地址：/user/register
* 请求方式：POST
* 请求参数：
~~~json
{
  "address":"TVjmtiAVdbox9LYtZ7eu8Bq7mHJFZCZ3dg",
  "name":"chenhao",
  "sign":"eff7d5dba32b4da32d9a67a519434d3f"
}
~~~
* 返回值：
~~~json
{
  "code": 0,
  "message": "成功"
}
~~~

### 2. 登录
* 接口地址：/user/login
* 请求方式：POST
* 请求参数：
~~~json
{
  "address":"TVjmtiAVdbox9LYtZ7eu8Bq7mHJFZCZ3dg",
  "sign":"ab56b4d92b40713acc5af89985d4b786"
}
~~~
* 成功返回值：
~~~json
{
  "code": 0,
  "message": "成功",
  "data": 
  {
    "access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjUsIkFkZHJlc3MiOiJhZHNmZHNmZHNmZHMxMWRmc2RzZmEiLCJpYXQiOjE1NDU0NTAwNTUsImV4cCI6MTU0NTUzNjQ1NX0.PwUqLko45qLQKIFCy6oC8CCODK1mug_xP4PKF8GjtUI",
    "expires_in":1545536455,
    "token_type":"Bearer"
  }
}
~~~
* 失败返回值：
~~~json
{
  "code": 10001,
  "message": "未注册"
}
~~~

### 3. 市场列表
* 接口地址：/idol/getMarketIdols
* 请求方式：get
* 请求参数：
~~~json
?page=1&pageSize=2&category=forsale&hairColors=blonde,brown,black,blue&eyeColors=brown,black&hairStyles=long hair,short hair&attributes=hasname,hasbio,cooldownready,dark skin,blush,smile,open mouth,hat,ribbon,glasses&filters=iteration:1~2,cooldown:ur|ssr|sr|r|n,price:1~2&sort=-id
~~~
* 返回值：
~~~json
{"code":0,
"message":"",
"data":
  [
    {
      "TokenId":1,
      "NickName":"1",
      "UserId":5,
      "Genes":"0",
      "BirthTime":1,
      "Bio":"1",
      "Generation":1,
      "Pic":"/idol/000c1668c6b2.jpg",
      "Cooldown":0,
      "MatronId":0,
      "SireId":0
    },  
    {
      "TokenId":2,
      "NickName":"1",
      "UserId":1,
      "Genes":"0",
      "BirthTime":0,
      "Bio":"1",
      "Generation":2,
      "Pic":"/idol/00a1f298bbe0.jpg",
      "Cooldown":0,
      "MatronId":0,
      "SireId":0
    }
  ]
}
~~~

### 4. 我的列表
* 接口地址：/idol/getMyIdols
* 请求方式：get
* 请求参数：
~~~json
?page=1&pageSize=2&category=forsale&hairColors=blonde,brown,black,blue&eyeColors=brown,black&hairStyles=long hair,short hair&attributes=hasname,hasbio,cooldownready,dark skin,blush,smile,open mouth,hat,ribbon,glasses&filters=iteration:1~2,cooldown:ur|ssr|sr|r|n,price:1~2&sort=-id
~~~
* 返回值：
~~~json
{"code":0,
"message":"",
"data":
  [
    {
      "TokenId":1,
      "NickName":"1",
      "UserId":5,
      "Genes":"0",
      "BirthTime":1,
      "Bio":"1",
      "Generation":1,
      "Pic":"/idol/000c1668c6b2.jpg",
      "Cooldown":0,
      "MatronId":0,
      "SireId":0
    },  
    {
      "TokenId":2,
      "NickName":"1",
      "UserId":1,
      "Genes":"0",
      "BirthTime":0,
      "Bio":"1",
      "Generation":2,
      "Pic":"/idol/00a1f298bbe0.jpg",
      "Cooldown":0,
      "MatronId":0,
      "SireId":0
    }
  ]
}
~~~

### 5. 获取Idol详情
* 接口地址：/idol/getIdol
* 请求方式：get
* 请求参数：
~~~
?tokenId=1
~~~
* 请求头：
如果有cookie请带上，这是用户的登录信息，服务端根据用户信息获取是否点过赞。
~~~
Cookie:csrfToken=IHoPCGBkcxULU7tpQOXl2Zyr; locale=en-us; tron_Idol_1544608605980_4384=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjUsIkFkZHJlc3MiOiJhZHNmZHNmZHNmZHMxMWRmc2RzZmEiLCJpYXQiOjE1NDUyODY2NzEsImV4cCI6MTU0NTM3MzA3MX0.cPKzSnTw96zoQFAldR1Vkma0HLG2nGgdgdpxjFgo1lY; undefined_1544608605980_4384.sig=Pqqz-SZgb5Fzm3jA7BvbZsRu016fWhPHtDhlvXW7SnI
~~~
* 返回值：
~~~json
{
	"code": 0,
	"message": "成功",
	"data": {
		"TokenId": 1,
		"NickName": "1",
		"UserId": 5,
		"Genes": "0",
		"BirthTime": 1,
		"Bio": "1",
		"Generation": 1,
		"Pic": "/idol/000c1668c6b2.jpg",
		"Cooldown": 0,
		"MatronId": 0,
		"SireId": 0,
		"LikeId": 0,
		"IsLike": 0
	}
}
~~~

### 6. 点赞


### 7. 取消点赞

