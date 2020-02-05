
//let apiBaseURL = 'https://plugin.yidu.ai/api/extension/';

var host = getApp().globalData.ENVIRONMENT_CONFIG.host;
let apiBaseURL = host + '/interview/video/';

export default {
    join: apiBaseURL + 'join',
    hasjoin: apiBaseURL + 'hasjoin',
}
