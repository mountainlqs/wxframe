import config from '../base/appconfig'
export default {
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
          return config.SERVERHOST + config.ADDRES+ url.replace(reg, '')
        } else {
            console.error('url不能为空')
        }
    },
    clearLinkUrl(url) {
        if (url) {
            url = decodeURIComponent(url)
            const reg = new RegExp(
                `[a-zA-z]+://[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62}|(:[0-9]{1,4}))+/`
            )
            return url.replace(reg, '')
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

    getNowTimeOrAdd(sysTime, hours = 0, isFormat = true) {
        let timp = {};
        if (!sysTime) {
            sysTime = new Date();
        } else {
            // if (sysTime.indexOf('T') > -1) {
            //     sysTime = sysTime.replace('T', ' ');
            // }
            if (sysTime.indexOf('+') > -1) {
                sysTime = sysTime.substring(0, sysTime.indexOf('+'));
            }
            sysTime = new Date(sysTime.replace(new RegExp("/", "gm"), "-"));
        }
        if (hours > 0) {
            sysTime = new Date((sysTime.getTime() / 1000 + (3600 * hours)) * 1000); 
        }
        timp.hour = sysTime.getHours();
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
    },
    /**
     * 获取两点间的距离
     */
    getDistanceFromTwo(la1, la2, lo1, lo2) {
      // const d * Math.PI / 180.0
      const radLat1 = this.getLoLa(la1);
      const radLat2 = this.getLoLa(la2);
      const a = radLat1 - radLat2;
      const b = this.getLoLa(lo1) - this.getLoLa(lo2);
      var s = 2 * Math.asin(Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6371.393;
      s = Math.round(s * 1000);//m
      if (s <= 5000)
        return true;
      else
        return false;
    },
    getLoLa(d) {
      return d * Math.PI / 180.0;
    }
}