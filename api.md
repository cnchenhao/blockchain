测试服务器地址：http://47.100.77.82:7001

### 1. 注册
* 接口地址：/user/register
* 请求方式：POST
* 请求参数：
~~~json
{
    "address":"TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY",
    "timestamp":1545647087,
    "name":"chenhao",
    "sign":"0xe54bf08ce2dd7683732d5c6cff5f0d3a4bdccc053f76ecf7fee4052538d5a3e96f167a0ddf657b77f1d3d662dfaf8c1008eac3746e48e5f9cee4ba130082481a1b"
}
~~~
sign算法：
~~~javascript
var timestamp = Math.round(new Date().getTime() / 1000);
let address = 'TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY';
let signMessage = "address=" + address + "&timestamp=" + timestamp; //拼出待签名字符串

let hexStr = this.strToHexCharCode(signMessage); //转成十六进制
let sign = await tronWeb.trx.signMessage(hexStr); //签名
~~~

* 返回值：
~~~json
{
    "code":0,
    "message":"成功"
}
~~~

### 2. 登录
* 接口地址：/user/login
* 请求方式：POST
* 请求参数：
~~~json
{
    "address":"TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY",
    "timestamp":1545647087,
    "sign":"0xe54bf08ce2dd7683732d5c6cff5f0d3a4bdccc053f76ecf7fee4052538d5a3e96f167a0ddf657b77f1d3d662dfaf8c1008eac3746e48e5f9cee4ba130082481a1b"
}
~~~
sign算法：
~~~javascript
var timestamp = Math.round(new Date().getTime() / 1000);
let address = 'TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY';
let signMessage = "address=" + address + "&timestamp=" + timestamp; //拼出待签名字符串

let hexStr = this.strToHexCharCode(signMessage); //转成十六进制
let sign = await tronWeb.trx.signMessage(hexStr); //签名
~~~

* 成功返回值：
~~~json
{
    "code":0,
    "message":"成功",
    "data":{
        "access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjUsIkFkZHJlc3MiOiJhZHNmZHNmZHNmZHMxMWRmc2RzZmEiLCJpYXQiOjE1NDU0NTAwNTUsImV4cCI6MTU0NTUzNjQ1NX0.PwUqLko45qLQKIFCy6oC8CCODK1mug_xP4PKF8GjtUI",
        "expires_in":1545536455,
        "token_type":"Bearer"
    }
}
~~~
* 失败返回值：
~~~json
{
    "code":10001,
    "message":"未注册"
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
{
    "code":0,
    "message":"",
    "data":[
        {
            "TokenId":1,        //idol的编号
            "NickName":"1",     //idol的名称
            "UserId":5,         //address登录后，后台分配的用户Id
            "Genes":"0",        //基因
            "BirthTime":1,      //出生时间，unix时间戳
            "Bio":"1",          //idol的自我介绍
            "Generation":1,     //代
            "Pic":"/idol/000c1668c6b2.jpg",
            "Cooldown":0,       //idol的冷却时间对应的index索引，ur|ssr|sr|r|n，|4|3|2|1|0
            "MatronId":0,       //母idol的tokenId
            "SireId":0          //父idol的tokenId
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
{
    "code":0,
    "message":"",
    "data":[
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
    "code":0,
    "message":"成功",
    "data":{
        "TokenId":1,            //idol的编号
        "NickName":"BTC",       //idol的名称
        "UserId":5,             //address登录后，后台分配的用户Id
        "Genes":"0",            //基因
        "BirthTime":1545471392, //出生时间，unix时间戳
        "Bio":"chenhao test",   //idol的自我介绍
        "Generation":0,         //代
        "Pic":"/idol/BTCfgd31ucjx9.png",
        "Cooldown":0,           //idol的冷却时间对应的index索引，ur|ssr|sr|r|n，|4|3|2|1|0
        "MatronId":0,           //母idol的tokenId
        "SireId":0,             //父idol的tokenId
        "LikeId":19,
        "HairColor":"black",    //头发颜色
        "EyeColor":"brown",     //眼睛颜色
        "HairStyle":"long hair",//发型
        "Attributes":"smile,open mouth", //特征，多个逗号隔开
        "Labels":"cute,queen",  //标签，多个逗号隔开
        "IsLike":1              //当前用户是否点赞，0否，1是
    }
}
~~~

### 6. 点赞
* 接口地址：/idol/like
* 请求方式：POST
* 请求参数：
~~~json
{
    "tokenId":1
}
~~~
* 请求头：

如果有cookie请带上，这是用户的登录信息。
~~~
Cookie:csrfToken=IHoPCGBkcxULU7tpQOXl2Zyr; locale=en-us; tron_Idol_1544608605980_4384=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjUsIkFkZHJlc3MiOiJhZHNmZHNmZHNmZHMxMWRmc2RzZmEiLCJpYXQiOjE1NDUyODY2NzEsImV4cCI6MTU0NTM3MzA3MX0.cPKzSnTw96zoQFAldR1Vkma0HLG2nGgdgdpxjFgo1lY; undefined_1544608605980_4384.sig=Pqqz-SZgb5Fzm3jA7BvbZsRu016fWhPHtDhlvXW7SnI
~~~
* 成功返回值：
~~~json
{
    "code":0,
    "message":"成功"
}
~~~
* 失败返回值：
~~~json
{
    "code":10002,
    "message":"未登录，请先登录"
}
~~~

### 7. 取消点赞
* 接口地址：/idol/unlike
* 请求方式：POST
* 请求参数：
~~~json
{
    "tokenId":1
}
~~~
* 请求头：

如果有cookie请带上，这是用户的登录信息。
~~~
Cookie:csrfToken=IHoPCGBkcxULU7tpQOXl2Zyr; locale=en-us; tron_Idol_1544608605980_4384=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjUsIkFkZHJlc3MiOiJhZHNmZHNmZHNmZHMxMWRmc2RzZmEiLCJpYXQiOjE1NDUyODY2NzEsImV4cCI6MTU0NTM3MzA3MX0.cPKzSnTw96zoQFAldR1Vkma0HLG2nGgdgdpxjFgo1lY; undefined_1544608605980_4384.sig=Pqqz-SZgb5Fzm3jA7BvbZsRu016fWhPHtDhlvXW7SnI
~~~
* 成功返回值：
~~~json
{
    "code":0,
    "message":"成功"
}
~~~
* 失败返回值：
~~~json
{
    "code":10002,
    "message":"未登录，请先登录"
}
~~~

### 8. 设置idol昵称
* 接口地址：/idol/setName
* 请求方式：POST
* 请求参数：
~~~json
{
    "tokenId":1,
    "name":"chenhao"
}
~~~
* 请求头：

如果有cookie请带上，这是用户的登录信息。
~~~
Cookie:csrfToken=IHoPCGBkcxULU7tpQOXl2Zyr; locale=en-us; tron_Idol_1544608605980_4384=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjUsIkFkZHJlc3MiOiJhZHNmZHNmZHNmZHMxMWRmc2RzZmEiLCJpYXQiOjE1NDUyODY2NzEsImV4cCI6MTU0NTM3MzA3MX0.cPKzSnTw96zoQFAldR1Vkma0HLG2nGgdgdpxjFgo1lY; undefined_1544608605980_4384.sig=Pqqz-SZgb5Fzm3jA7BvbZsRu016fWhPHtDhlvXW7SnI
~~~
* 成功返回值：
~~~json
{
    "code":0,
    "message":"成功"
}
~~~
* 失败返回值：
~~~json
{
    "code":10002,
    "message":"未登录，请先登录"
}
~~~

### 9. 设置idol简介
* 接口地址：/idol/setBio
* 请求方式：POST
* 请求参数：
~~~json
{
    "tokenId":1,
    "bio":"chenhao test"
}
~~~
* 请求头：

如果有cookie请带上，这是用户的登录信息。
~~~
Cookie:csrfToken=IHoPCGBkcxULU7tpQOXl2Zyr; locale=en-us; tron_Idol_1544608605980_4384=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjUsIkFkZHJlc3MiOiJhZHNmZHNmZHNmZHMxMWRmc2RzZmEiLCJpYXQiOjE1NDUyODY2NzEsImV4cCI6MTU0NTM3MzA3MX0.cPKzSnTw96zoQFAldR1Vkma0HLG2nGgdgdpxjFgo1lY; undefined_1544608605980_4384.sig=Pqqz-SZgb5Fzm3jA7BvbZsRu016fWhPHtDhlvXW7SnI
~~~
* 成功返回值：
~~~json
{
    "code":0,
    "message":"成功"
}
~~~
* 失败返回值：
~~~json
{
    "code":10002,
    "message":"未登录，请先登录"
}
~~~
