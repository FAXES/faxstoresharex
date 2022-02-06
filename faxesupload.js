const fs = require("fs"); // Do not remove :P
const sharexUploaderConfig = {
    fileCharacterLength: 5,
    fileSecret: 'MySecret'
}

makeUniqueSet = function(length) {
    var result = '';var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';var charactersLength = characters.length;
    for( var i = 0; i < length; i++ ) {result += characters.charAt(Math.floor(Math.random() * charactersLength));}return result;
}
module.exports = function(app) {
    setTimeout(() => {console.log(`ShareX file uploader started.`);}, 800);
    app.get('/i/:item', async function (req, res) {
        let item = req.params.item;
        if(fs.existsSync(`./files/i/${item}`)) {
            res.sendFile(`./files/i/${item}`, {root: __dirname})
        } else {
            res.redirect('/404')
        }
    });
    app.get('/u/:item', async function (req, res) {
        let item = req.params.item;
        if(fs.existsSync(`./files/u/${item}`)) {
            res.sendFile(`./files/u/${item}`, {root: __dirname})
        } else {
            res.redirect('/404')
        }
    });
    app.post('/uploadimage', async function(req, res) {
        var fileId = makeUniqueSet(sharexUploaderConfig.fileCharacterLength);
        const secret = req.body.secret;
        if(secret !== sharexUploaderConfig.fileSecret) res.send('Invalid Secret Key')
        const file = req.files[0];
        if(file) {
            var nameExt = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
            fs.writeFileSync(`./files/i/${fileId}.${nameExt}`, file.buffer);
            res.json({status: "OK", errormsg: "", url: `${fileId}.${nameExt}`});
        } else {
            res.send('No post data recieved')
        }
    });
    app.post('/uploadfile', async function(req, res) {
        var fileId = makeUniqueSet(sharexUploaderConfig.fileCharacterLength);
        const secret = req.body.secret;
        if(secret !== sharexUploaderConfig.fileSecret) res.send('Invalid Secret Key')
        const file = req.files[0];
        if(file) {
            var nameExt = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
            fs.writeFileSync(`./files/u/${fileId}.${nameExt}`, file.buffer);
            res.json({status: "OK", errormsg: "", url: `${fileId}.${nameExt}`});
        } else {
            res.send('No post data recieved')
        }
    });
}