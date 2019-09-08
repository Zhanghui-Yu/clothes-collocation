function formatData(data) {
    const result = Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&');
    return result;
}
class http {
    get(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))

        })
    }


    post(url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                mode:'cors',
                body: formatData(data)
            })
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))

        })
    }

}
export default new http();//ES6导出
