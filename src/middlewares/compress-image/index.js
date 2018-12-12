const colors = require("colors");
const { isCommonImage } = require("../../util/fileUtil");
const imageOptim = require("./imageOptim/index");
const tinyPng = require("./tinyPng/index");
const { appendIgnoreFiles } = require("../ignore/helper");

async function compressImage(ctx, next) {
  console.log("before compressImage");
  let files = [];
  for (let file of ctx.files) {
    if (isCommonImage(file)) {
      files.push(file);
    }
  }

  if (files.length < 1) {
    console.log(colors.green("no common image need to be compressed."));
  } else {
    const program = ctx.program;

    if (program.compress && program.compress.toString() === "tinyPng") {
      const result = await tinyPng(files, program.key).catch(function(err) {
        console.log(colors.red(err));
      });
      await appendIgnoreFiles(result).catch(function(err) {
        console.log(colors.red(err));
      });
    } else {
      const result = await imageOptim(files).catch(function(err) {
        console.log(colors.red(err));
      });
      await appendIgnoreFiles(result).catch(function(err) {
        console.log(colors.red(err));
      });
    }
  }

  await next();
  console.log("after compressImage");
}

module.exports = compressImage;
