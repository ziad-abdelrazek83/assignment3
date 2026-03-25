// 1
const fs = require("node:fs");

const readStream = fs.createReadStream("./big.txt", {
    encoding: "utf-8"
});

readStream.on("data", (chunk) => {
    console.log(chunk);
});


// 2

const fs = require("node:fs");

const readStream = fs.createReadStream("./source.txt", {
    encoding: "utf-8"
});

const writeStream = fs.createWriteStream("./dest.txt");

readStream.pipe(writeStream);

writeStream.on("finish", () => {
    console.log("File copied using streams");
});



// 3
const fs = require("node:fs");
const zlib = require("node:zlib");

const readStream = fs.createReadStream("./data.txt", {
    encoding: "utf-8"
});

const writeStream = fs.createWriteStream("./data.txt.gz");

const gzip = zlib.createGzip();

readStream.pipe(gzip).pipe(writeStream);

writeStream.on("finish", () => {
    console.log("File compressed successfully");
});
