<!--
 * @Author: 羚羊公子
 * @FilePath: \welfare_tips\README.md
-->

# 🐐 翻山羊线报网

翻山羊线报网前端开源代码，本项目可以让你轻松对接聚推客的福利线报，然后直接进行推广赚取佣金，所有活动都可以，本次项目仅开源前端代码方便大家自行修改部分内容，比如名字、logo 等等，也可以二开该项目写成自己想要的样子！

## 🧰 前台网站配置说明

如果有编程经验可以自行克隆源代码进行操作，如果没有编程经验可以直接下载 Releases 中打包好的名为：weifare_web.zip 的压缩包，解压后只需要配置 config.js 文件即可。

### ✍config.js 配置内容

1. **VITE_API_URL**: "后端授权域名结尾不需要斜杠/(例如：http://xxx.xxx.cn)"

2. **VITE_title**: "网站标题"

3. **VITE_description**: "网站描述"

4. **VITE_keywords**: "网站关键词"

![](https://raw.githubusercontent.com/lygzblog/githubImg/refs/heads/main/welfare_tip_config.webp)

---

## 🐨 后端配置说明

下载 Releases 中名为 welfare_server.zip 的压缩包，里面就两个文件：main 的服务文件和 settings.yaml 配置文件，配置前要求开放服务器端口：**5733**，否则后端服务无法访问！

### ✍ 配置 settings.yaml 文件

> 具体相关配置文件里面自有说明，查看 settings.yaml 文件即可！

1. apikey：**api 密钥**

2. authorizationKey：**域名授权密钥**
