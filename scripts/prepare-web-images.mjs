import {readFile,writeFile} from "node:fs/promises";
import assert from "node:assert/strict";
import sharp from "sharp";

// Lossless transport variants: original dimensions, alpha and decoded pixels are retained.
const names=["gallery-ferrari-magenta","gallery-raptor-black","gallery-ktm-black","gallery-yamaha-r1-blue","workflow-install","consultation-vinyl"];
for(const name of names){
  const source=new URL(`../public/images/${name}.png`,import.meta.url);
  const input=await readFile(source);
  const output=await sharp(input).webp({lossless:true,effort:6}).toBuffer();
  const original=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const decoded=await sharp(output).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(decoded.info.width,original.info.width);assert.equal(decoded.info.height,original.info.height);
  assert.deepEqual(decoded.data,original.data,`${name}: lossless pixel verification`);
  await writeFile(new URL(`../public/images/${name}.lossless.webp`,import.meta.url),output);
  console.log(`${name}: ${Math.round((1-output.length/input.length)*100)}% fewer bytes, identical decoded pixels`);
}
