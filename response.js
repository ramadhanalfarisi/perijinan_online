get = (status,value,res) => {
    let data = {
        code : 200,
	    success: true,
        value: value,
        status: status
    }
    res.json(data);
    res.end();
}

gagal = (status,message,res) => {
    let data = {
	    success: false,
        status: status,
        message: message
    }
    res.json(data)
    res.end();
}

post = (status,res) => {
    let data = {
        code : 200,
        status: status
    }
    res.json(data);
    res.end();
}

module.exports = {
    get,
    post,
    gagal
}