var constants = require('./constants');
// var SESSION_KEY = 'uinfo' + constants.WX_SESSION_MAGIC_ID;
var SESSION_KEY='uinfo'
var Session = {
    get: function () {
        return wx.getStorageSync(SESSION_KEY) || null;
    },

    set: function (session) {
        wx.setStorageSync(SESSION_KEY, session);
    },

    clear: function () {
        wx.removeStorageSync(SESSION_KEY);
    },
};

module.exports = Session;