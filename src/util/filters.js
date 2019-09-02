/**
 * Created by choizhang on 2018/1/31.
 */
//import Vue from 'vue';
import Moment from 'moment';

Vue.filter('formatTime', (time, type) => {
    time = Number(time) < 10000000000 ? Number(time) * 1000 : time;
    if (type) {
        return Moment(time).format(type);
    } else {
        return Moment(time).format('YYYY-MM-DD HH:mm:ss');
    }
});

Vue.filter('formatTime2', (time, type) => {
    time = Number(time) < 10000000000 ? Number(time) * 1000 : time;
    if (type) {
        return Moment(time).format(type);
    } else {
        return Moment(time).format('YYYY-MM-DD');
    }
});

Vue.filter('formatSize', (bytes) => {
    if (bytes === 0) return '0 B';
    var k = 1000, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
});

Vue.filter('decodeURI', (url) => {
    if (url) {
        return decodeURIComponent(url)
    }
    return "";
})
Vue.filter('formatPrice', (value) => {
    if (value) {
        return (Number(value) / 100).toFixed(2);
    } else {
        return "0.00";
    }
})

Vue.filter('parseIntPrice', (value) => {
    if (value) {
        return (Number(value) / 100);
    } else {
        return 0
    }
});

Vue.filter('filterWeekday', (value) => {
    if (value === "mon") {
        return "星期一"
    }
    if (value === "tue") {
        return "星期二"
    }
    if (value === "wed") {
        return "星期三"
    }
    if (value === "thu") {
        return "星期四"
    }
    if (value === "fri") {
        return "星期五"
    }
    if (value === "sat") {
        return "星期六"
    }
    if (value === "sun") {
        return "星期天"
    } else {
        return ""
    }
})
