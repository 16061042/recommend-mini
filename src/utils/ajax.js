'use strict';


export default {
    post(data, url) {
        return new Promise( (resolve, reject) => {
            uni.request({
                method: 'POST',
                url: url,
                data: data,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                success: (response) => {
                    resolve(response)
                },
                fail: (response) => {
                    reject(response)
                }
            });
        });
    },

     get(data = null, url) {
        return new Promise( (resolve, reject) => {
            uni.request({
                method: 'GET',
                url: url,
                data: data,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                success: (response) => {
                    resolve(response)
                },
                fail: (response) => {
                    reject(response)
                }
            })
        });
    }
}
