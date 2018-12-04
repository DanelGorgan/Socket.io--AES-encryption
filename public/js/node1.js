var key3 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
var mode = ''

function encryptCBC(text) {
// The initialization vector (must be 16 bytes)
    var iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
    var textBytes = aesjs.utils.utf8.toBytes(text);

    var aesCbc = new aesjs.ModeOfOperation.cbc(key3, iv);
    var encryptedBytes = aesCbc.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    console.log('Encripted text is: ' + encryptedHex);
    return encryptedHex
}

function encryptECB(text) {
    var textBytes = aesjs.utils.utf8.toBytes(text);


    var aesCbc = new aesjs.ModeOfOperation.ecb(key3);
    var encryptedBytes = aesCbc.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    console.log('Encripted text is: ' + encryptedHex);
    return encryptedHex

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

function openFile(event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function () {
        var text = reader.result;
        let crypted
        mode === 'CBC' ? crypted = encryptCBC(text) : crypted = encryptECB(text)
        socket.emit("cryptedFile", crypted);
    };
    reader.readAsText(input.files[0]);
};


var socket = io.connect('http://localhost:8081');

socket.on("announce", function (data) {
    let test = document.getElementById('announce');
    setTimeout(() => {
        test.innerHTML = "<p style=\"display: block;\">Am primit de la nodul 2 mesajul: " + data + " </p>";
    }, 2000)
});

socket.on("getEncryptedKey", function (data) {
    let test = document.getElementById('key');
    let test1 = document.getElementById('decrypt');
    test.innerHTML = "<p style=\"display: block;\">Am primit cheia encriptata:" + data.message + " </p>";
    let decrypt = decryptKey(data.message);
    test1.innerHTML = "<p style=\"display: inline-block;\">Am decriptat cheia si are valoarea: </p>" + decrypt

});

var key3 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];


function sendOP() {
    let word = document.getElementById('comunicare').value;
    if (word === 'CBC' || word === 'ECB') {
        mode = word
        socket.emit("sendOP", {message: word});
    } else {
        alert('Input invalid!')
    }
}