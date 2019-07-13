
function FetchQuizApi() {
    return new Promise((resolve, reject) => {
        fetch('https://opentdb.com/api.php?amount=10').then(e =>
            e.json()
        ).then((e) => {
            resolve(e.results)
        })
            .catch((e) => {
                reject('error ===> ', e)
            })
    })
}

export {
    FetchQuizApi
}