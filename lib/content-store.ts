import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import defaults from "./content-defaults.json";
import type { SiteContent } from "./content-types";
import { AppError, validateContent } from "./content-validation";

export const DATA_DIR=path.resolve(process.env.ZAN_DATA_DIR||path.join(process.cwd(),"data"));
export const UPLOAD_DIR=path.join(DATA_DIR,"uploads");
const CONTENT_FILE=path.join(DATA_DIR,"content.json");
let queue:Promise<unknown>=Promise.resolve();
export async function readContent():Promise<SiteContent>{
  try{return JSON.parse(await readFile(CONTENT_FILE,"utf8")) as SiteContent;}
  catch(error){if((error as NodeJS.ErrnoException).code==="ENOENT")return structuredClone(defaults) as SiteContent;throw error;}
}
export async function saveContent(input:unknown){
  const data=validateContent(input);
  const operation=queue.then(async()=>{
    const current=await readContent();
    if(data.revision!==current.revision)throw new AppError("Data sudah berubah di tab lain. Muat ulang sebelum menyimpan.",409);
    const saved={...data,revision:current.revision+1};
    await mkdir(DATA_DIR,{recursive:true});
    const temporary=path.join(DATA_DIR,`content-${randomUUID()}.tmp`);
    await writeFile(temporary,JSON.stringify(saved,null,2),{mode:0o600});
    await rename(temporary,CONTENT_FILE);
    return saved;
  });
  queue=operation.catch(()=>{});
  return operation;
}
