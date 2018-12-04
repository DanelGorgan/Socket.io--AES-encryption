let express = require('express')
let socket = require('socket.io')
let http = require('http')
let path = require('path')
let aesjs = require('aes-js');

// 128-bit, 192-bit and 256-bit keys
var key1 = "anaaremeresipere";
var key2 = "astaestecheiadoi";
var key3 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

let app = express();
app.server = http.createServer(app);

app.use(express.static(__dirname + '/public'));


app.server.listen(8081, () => {
    console.log(`Started on port 8081`)
});

function encryptKey(string) {
    let text
    string === 'CBC'? text = key1 : text = key2
    var textAsBytes = aesjs.utils.utf8.toBytes(text)
    console.log(textAsBytes);
// [65, 66, 108, 111, 99, 107, 73, 115, 49, 54, 66, 121, 116, 101, 115, 33]

// create an instance of the block cipher algorithm
    var aes = new aesjs.AES(key3);

// encrypt...
    var encryptedBytes = aes.encrypt(textAsBytes);
    console.log(encryptedBytes);
// [136, 15, 199, 174, 118, 133, 233, 177, 143, 47, 42, 211, 96, 55, 107, 109]

// To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    console.log(encryptedHex);
    return encryptedHex
}

app.get('/node1', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/node1.html'))
});

app.get('/node2', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/node2.html'))
});

let io = socket(app.server);
io.on('connection', function (socket) {
    socket.on('crypt', function (data) {
        console.log('Am primit de la client: ');
        console.log(data);
        let cryptedText = encryptCBC(data.message)
        io.emit("crypt", {message: cryptedText});
    });
    socket.on('decrypt', function (data) {
        console.log('Am primit de la client: ');
        console.log(data);
        let cryptedText = decryptCBC(data.message)
        io.emit("crypt", {message: cryptedText});
    });

    socket.on('cryptedFile', function (data) {
        io.emit("cryptedFile", data);
    });
    socket.on('sendOP', function (data) {
        console.log('Am primit de la client: ');
        console.log(data);
        io.emit("getOP", data);
    });


    socket.on('getKey', function (data) {
        console.log('Am primit de la client: ');
        console.log(data);
        let cryptedText = encryptKey('ECB');
        io.emit("getEncryptedKey", {message: cryptedText});
    });
    socket.on('announceNode1', function (data) {
        io.emit("announce", data);
    });
});



