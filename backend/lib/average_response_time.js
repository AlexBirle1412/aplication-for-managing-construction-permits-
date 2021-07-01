const path = require("path");
const readline = require("readline");
const fs = require("fs");

//var logger = fs.createWriteStream("auxiliary.txt", {});

let reqPath = path.join(__dirname, "../access.log");
const readInterface = readline.createInterface({
  input: fs.createReadStream(reqPath),
  output: null,
  console: false,
});

let sum = 0;
let number = 0;
let result;
readInterface
  .on("line", function (line) {
    let auxLine = line.slice();
    let b;
    let auxVector = [];
    for (let i = 0; i < 3; i++) {
      b = auxLine.slice(0, -1);
      auxLine = b;
    }
    for (let j = auxLine.length; j >= 0; j--) {
      if (auxLine[j] != " ") auxVector.unshift(auxLine[j]);
      else break;
    }
    auxVector.pop();
    let myString = auxVector.join("");
    let finalResult = parseFloat(myString);
    sum += finalResult;
    // logger.write("LINIA " + number + " -->" + finalResult);
    // logger.write("\n");
    number++;
  })
  .on("close", function () {
    result = sum / number;
    console.log("TIMPLUL MEDIU AL TUTUROR REQUESTURI-LOR ESTE " + result);
  });
