// 配置
let envir = 'online'
let ENVIRONMENT_CONFIG = {}

let configMap = {
    test: {
        appid: 'wxa814abd8ea4ac5f1',
        host:'http://wymdev.5kong.com',
        imageUrl: 'https://oss.hinapower.com/cdn/app/tr/image/share.png',
        code: 'appCode=test'
    },
    online: {
        appid: 'wxa814abd8ea4ac5f1',
        host:'https://tr.hinapower.com',
        imageUrl: 'https://oss.hinapower.com/cdn/app/tr/image/share.png',
        code: 'appCode=trApp'
    },
};
ENVIRONMENT_CONFIG = configMap[envir];
module.exports = ENVIRONMENT_CONFIG
