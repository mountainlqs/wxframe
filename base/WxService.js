/**
 * Promise 封装 wx 原生方法
 */
import config from './appconfig'
class WxService {
    constructor() {
        this.__init()
    }
    __init() {
        this.__initTools()
        this.__initDefaults()
        this.__initMethods()
    }
    __initTools() {
        this.tools = {
            isString(value) {
                return typeof value === 'string'
            },
            isArray(value) {
                return Array.isArray(value)
            },
            isObject(value) {
                return value !== null && typeof value === 'object'
            },
            isNumber(value) {
                return typeof value === 'number'
            },
            isDate(value) {
                return Object.prototype.toString.call(value) === '[object Date]'
            },
            isUndefined(value) {
                return typeof value === 'undefined'
            },
            toJson(obj, pretty) {
                if (this.isUndefined(obj)) return undefined
                if (!this.isNumber(pretty)) {
                    pretty = pretty ? 2 : null
                }
                return JSON.stringify(obj, null, pretty)
            },
            serializeValue(value) {
                if (this.isObject(value)) return this.isDate(value) ? value.toISOString() : this.toJson(value)
                return value
            },
            encodeUriQuery(value, pctEncodeSpaces) {
                return encodeURIComponent(value)
                    .replace(/%40/gi, '@')
                    .replace(/%3A/gi, ':')
                    .replace(/%24/g, '$')
                    .replace(/%2C/gi, ',')
                    .replace(/%3B/gi, ';')
                    .replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'))
            },
            paramSerializer(obj) {
                if (!obj) return ''
                let parts = []
                for (let key in obj) {
                    const value = obj[key]
                    if (value === null || this.isUndefined(value)) return
                    if (this.isArray(value)) {
                        value.forEach((v) => {
                            parts.push(this.encodeUriQuery(key) + '=' + this.encodeUriQuery(this.serializeValue(v)))
                        })
                    } else {
                        parts.push(this.encodeUriQuery(key) + '=' + this.encodeUriQuery(this.serializeValue(value)))
                    }
                }
                return parts.join('&')
            },
            buildUrl(url, obj) {
                const serializedParams = this.paramSerializer(obj)
                if (serializedParams.length > 0) {
                    url += ((url.indexOf('?') == -1) ? '?' : '&') + serializedParams
                }
                return url
            },
            formatTime(time) {
                if (time !== null && time !== undefined && time !== '') {
                    time = time.slice(0, -12);
                    time = time.replace('T', '日');
                } else {
                    time = null;
                }
                return time;
            },
            formatLinkUrl(url) {
                if (url) {
                    url = decodeURIComponent(url)
                    const reg = new RegExp(
                        `[a-zA-z]+://[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62}|(:[0-9]{1,4}))+/`
                    )
                    return config.SERVERHOST+config.ADDRES + url.replace(reg, '')
                } else {
                    console.error('url不能为空')
                }
            },
            extract(str) {
                var result = str ? str.substring(str.lastIndexOf('/') + 1) : '';
                result = result.indexOf('{') > -1 ? result.slice(0, result.indexOf('{')) : result;
                return result;
            },
            subStringCode(code) {
                return code.substring(6)
            },
            warn(text, obj, count) {
                var _this = obj;
                wx.showModal({
                    title: '友情提示',
                    content: text,
                    showCancel: false
                })
                // count = parseInt(count) ? parseInt(count) : 3000;
                // _this.setData({ toastText: text, isShowToast: true, display: 'none', array: [] });
                // setTimeout(function () {
                //     _this.setData({ isShowToast: false, display: 'block', isNull: true });
                // }, count);
            },
            msg(text, obj, count) {
                var _this = obj;
                wx.showModal({
                    title: '友情提示',
                    content: text,
                    showCancel: false,
                    mask: true,
                    success: function (res) {
                        // return res
                        if (res.confirm) {
                            wx.navigateBack({ delta: 1 });
                        }
                    }
                })
                // count = parseInt(count) ? parseInt(count) : 3000;
                // _this.setData({ toastText: text, isShowToast: true, display: 'none', array: [] });
                // setTimeout(function () {
                //     _this.setData({ isShowToast: false, display: 'block', isNull: true });
                // }, count);
            },
            loading(msg, time = 1000) {
                if (this.isString(msg)) {
                    wx.showToast({ title: msg, icon: 'loading', duration: time })
                } else {
                    this.loading('请显示字符串')
                }
            },
            showLoading(title = '加载中') {
                wx.showLoading({
                    title: title,
                    mask: true,
                })
            },
            success(msg) {
                if (this.isString(msg)) {
                    wx.showToast({ title: msg, icon: 'success', duration: 1000 })
                } else {
                    this.loading('请显示字符串')
                }
            },
            compareDate(one, two, equal = false) {
                if (one.length > 20) {
                    one = one.replace('T', ' ');
                    one = one.slice(0, -12);
                }
                if (two.length > 20) {
                    two = two.replace('T', ' ');
                    two = two.slice(0, -12);
                }
                one = new Date(one.replace(new RegExp("-", "gm"), "/"));
                two = new Date(two.replace(new RegExp("-", "gm"), "/"));
                if (equal) {
                    return one >= two;
                } else {
                    return one > two;
                }
            },
            getBySysTime(sysTime, dayCount = 0, isFormat = false) {
                let timp = {};
                if (sysTime.indexOf('T') > -1) {
                    sysTime = sysTime.replace('T', ' ');
                    sysTime = sysTime.slice(0, -12);
                    sysTime = new Date(sysTime.replace(new RegExp("-", "gm"), "/"));
                } else {
                    sysTime = new Date(sysTime.replace(new RegExp("-", "gm"), "/"));
                    // console.log('时间3', sysTime);
                }
                timp.hour = sysTime.getHours();
                if (dayCount > 0) {
                    sysTime = new Date((sysTime / 1000 + (86400 * dayCount)) * 1000);  //日期加1天 
                }
                if (isFormat) {
                    const mon = sysTime.getMonth() + 1;
                    const day = sysTime.getDate();
                    sysTime = sysTime.getFullYear() + "-" + (mon < 10 ? "0" + mon : mon) + "-" + (day < 10 ? "0" + day : day);   //把日期格式转换成字符串
                }
                timp.sysDate = sysTime;
                return timp;
            },
            trim(s) {
                return s.replace(/(^\s*)|(\s*$)/g, "");
            },
            checkPhone(phone) {
                const regexPhone = new RegExp("^((13[0-9])|(14[5|7|9])|(15([0-3]|[5-9]))|166|(17([1|3]|[5-8]))|(18[0-9])|(19([8|9])))\\d{8}$");//手机
                const regextel = "^(0\\d{2}-\\d{8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$";//固话
                if (!phone || !((phone.match(regexPhone) != null) || (phone.match(regextel) != null))) {
                    return false;
                }
                return true;
            },
            driNum(num) {
                const regexNum = new RegExp("^\\d{18}$");
                if (!num || !((num.match(regexNum) != null))) {
                    return false;
                }
                return true;
            }
        }
    }

    /**
     * __initDefaults
     */
    __initDefaults() {
        // 缓存非异步方法
        this.noPromiseMethods = [
            'stopRecord',
            'pauseVoice',
            'stopVoice',
            'pauseBackgroundAudio',
            'stopBackgroundAudio',
            'showNavigationBarLoading',
            'hideNavigationBarLoading',
            'createAnimation',
            'createContext',
            'hideKeyboard',
            'stopPullDownRefresh',
        ]

        // 缓存 wx 接口方法名
        this.instanceSource = {
            method: Object.keys(wx)
        }
    }

    /**
     * 遍历 wx 方法对象，判断是否为异步方法，是则构造 Promise
     */
    __initMethods() {
        for (let key in this.instanceSource) {
            this.instanceSource[key].forEach((method, index) => {
                this[method] = (...args) => {
                    // 判断是否为非异步方法或以 wx.on 开头，或以 Sync 结尾的方法
                    if (this.noPromiseMethods.indexOf(method) !== -1 || method.substr(0, 2) === 'on' || /\w+Sync$/.test(method)) {
                        return wx[method](...args)
                    }
                    return this.__defaultRequest(method, ...args)
                }
            })
        }

        const navigate = [
            'navigateTo',
            'redirectTo',
            'switchTab',
            // 'navigateBack', 
            'reLaunch',
        ]

        /**
         * 重写导航 API
         * @param {String} url  路径
         * @param {Object} params 参数
         */
        navigate.forEach((method, index) => {
            this[method] = (url, params) => {
                const obj = {
                    url,
                }
                if (method !== 'switchTab') {
                    obj.url = this.tools.buildUrl(url, params)
                }
                return this.__defaultRequest(method, obj)
            }
        });

        /**
         * 关闭当前页面，返回上一页面或多级页面
         * @param {Number} delta  返回的页面数，如果 delta 大于现有页面数，则返回到首页
         */
        this.navigateBack = (delta = 1) => {
            return wx.navigateBack({
                delta,
            })
        }
        /**
         * 发送请求
         */
        this.request = (url = '', method = '', param = {}) => {
            let obj = {};
            obj.url = this.tools.formatLinkUrl(url);
            obj.header = {
                'Content-Type': 'application/json',
                'Accept': '*/*',
            };
            obj.header['Authorization'] = 'Basic ' + wx.getStorageSync('token');
            obj.method = method;
            if (method == "PATCH") {//发送PATCH
                obj.header['PATCH_METHOD'] = "true";
                obj.method = 'PUT'
            }
            // if (method == "POST") {//发送POST
            //     obj.header['Content-Type'] = "application/x-www-form-urlencoded";
            // }
            obj.data = param;
            obj.dataType = 'json';

            return this.__defaultRequest("request", obj);
        }
        /**
         * 上传照片
         */
        this.uploadFile = (url = '', filePath = '', params = {}) => {
            let obj = {
                url: this.tools.formatLinkUrl(url),
                filePath: filePath,
                name: 'resource',
                header: {
                    "Content-Type": "multipart/form-data",
                    'accept': 'application/json',
                    'Authorization': 'Basic ' + wx.getStorageSync('token'),
                },
                formData: params,
            }
            return this.__defaultRequest("uploadFile", obj);
        }
    }

    /**
     * 以 wx 下 API 作为底层方法
     * @param {String} method 方法名
     * @param {Object} obj    接收参数
     */
    __defaultRequest(method = '', obj = {}) {
        return new Promise((resolve, reject) => {
            if (method == 'request' || method == 'uploadFile') {
                obj.success = (res) => {
                    if (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 204) {
                        resolve(res.data)
                    } else {
                        reject(res.data)
                    }
                }
            } else {
                obj.success = (res) => {
                    resolve(res)
                }
            }
            obj.fail = (res) => {
                console.log(res)
                if (res.statusCode === 401) {
                    wx.showToast({
                        title: '请重新登录', icon: 'loading', duration: 1000
                    })
                    wx.redirectTo({
                        url: '../../login/login',
                    })
                }
                if (res.errMsg == "request:fail ") {
                    wx.showToast({
                        title: '服务器暂停服务', icon: 'loading', duration: 1000
                    })
                }
                reject(res)
            }
            wx[method](obj)
        })
    }
}

export default WxService