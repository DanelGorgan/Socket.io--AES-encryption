var key3 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

function decryptCBC(text) {

// The initialization vector (must be 16 bytes)
    var iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

// When ready to decrypt the hex string, convert it back to bytes
    let encryptedBytes = aesjs.utils.hex.toBytes(text);

// The cipher-block chaining mode of operation maintains internal
// state, so to decrypt a new instance must be instantiated.
    aesCbc = new aesjs.ModeOfOperation.cbc(key3, iv);
    var decryptedBytes = aesCbc.decrypt(encryptedBytes);

// Convert our bytes back into text
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    console.log('Decrypted text is: ' + decryptedText);
    return decryptedText
}

function decryptECB(text) {
// When ready to decrypt the hex string, convert it back to bytes
    let encryptedBytes = aesjs.utils.hex.toBytes(text);

// The cipher-block chaining mode of operation maintains internal
// state, so to decrypt a new instance must be instantiated.
    aesCbc = new aesjs.ModeOfOperation.ecb(key3);
    var decryptedBytes = aesCbc.decrypt(encryptedBytes);

// Convert our bytes back into text
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    console.log('Decrypted text is: ' + decryptedText);
    return decryptedText
}

function decryptKey(text) {
// create an instance of the block cipher algorithm
    var aes = new aesjs.AES(key3);

// When ready to decrypt the hex string, convert it back to bytes
    var encryptedBytes = aesjs.utils.hex.toBytes(text);

// decrypt...
    var decryptedBytes = aes.decrypt(encryptedBytes);
    console.log(decryptedBytes);
// [65, 66, 108, 111, 99, 107, 73, 115, 49, 54, 66, 121, 116, 101, 115, 33]


// decode the bytes back into our original text
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    return decryptedText
}

var socket = io.connect('http://localhost:8081');
var mode = ''
socket.on("cryptedFile", function (data) {
    let test = document.getElementById('encripted');
    test.innerHTML = "<p style=\"display: block;\">Am primit cheia encriptata:" + data + " de la primul nod </p>";
    let test1 = document.getElementById('decripted');
    let decrypt
    mode === 'CBC' ? decrypt = decryptCBC(data) : decrypt = decryptECB(data)
    test1.innerHTML = "<p style=\"display: block;\">Am decriptat cheia si am obtinut:" + decrypt + "</p>";
});

socket.on("getEncryptedKey", function (data) {
    let test = document.getElementById('key');
    let test1 = document.getElementById('decrypt');
    test.innerHTML = "<p style=\"display: block;\">Am primit cheia encriptata:" + data.message + " </p>";
    let decrypt = decryptKey(data.message);
    test1.innerHTML = "<p style=\"display: inline-block;\">Am decriptat cheia si are valoarea: </p>" + decrypt
    socket.emit("announceNode1", 'Putem sa incepem comunicarea!');
});

socket.on("getOP", function (data) {
    let test = document.getElementById('OP');
    test.innerHTML = "<p style=\"display: inline;\">Am primit de la primul nod: </p>" + data.message;
    setTimeout(() => {
        mode = data.message
        socket.emit("getKey", 'Give me encrypted key pls');
    }, 2000)
});