'use strict'
const Unicode = {
    stringify: function (str) {
        const res = [],
            len = str.length;
        for (let i = 0; i < len; ++i) {
            res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-3).toUpperCase();
        }
        return str ? "\\" + res.join("\\u") : "";
    },
    parse: function (str) {
        str = str.replace(/\\/g, "%");
        return unescape(str);
    }
};

module.exports = Unicode;
