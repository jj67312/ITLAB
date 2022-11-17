module.exports.setOptions1 = function () {
    const options = {
        method: 'GET',
        url: 'https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/35878/team/9',
        headers: {
            'X-RapidAPI-Key':
                'd51af76919mshf660fc0ad027235p1bb72cjsn1382cf4f0ecf',
            'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com',
        },
    };
    return options;
};

module.exports.setOptions2 = function () {
    const options = {
        method: 'GET',
        url: 'https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/35878/scard',
        headers: {
            'X-RapidAPI-Key':
                'd51af76919mshf660fc0ad027235p1bb72cjsn1382cf4f0ecf',
            'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com',
        },
    };
    return options;
};
