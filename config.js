/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
   var host = '你的域名'; //开发环境
   

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,
        addUserUrl: `${host}/weapp/addUser`,
        addCarUrl: `${host}/weapp/addCar`,
        getLocUrl: `${host}/weapp/getloc`,
        chartUrl: `${host}/weapp/chart`,
        searchUserCar: `${host}/weapp/searchUserCar`,
        searchUrl: `${host}/weapp/searchCar`,
        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,
        author: `${host}/weapp/author`,
        message: `${host}/weapp/message`,
        getTell: `${host}/weapp/getTell`,
        tmp: `${host}/weapp/tmp`,
        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`
    }
};

module.exports = config;
