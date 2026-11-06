import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const code = await readFile(new URL("../lib/material-preview.ts", import.meta.url), "utf8");
const output = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { materialDefaultFinish, materialSurface } = await import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
const custom = { name: "Bahan Baru Admin", type: "Matte Vinyl" };
assert.equal(materialDefaultFinish(custom), "Matte");
assert.equal(materialDefaultFinish({ name: "Seri Baru", type: "High Gloss & Satin Cast" }), "Gloss");
assert.equal(materialDefaultFinish({ name: "Seri Baru", type: "Cast Vinyl" }), "Satin");
assert.equal(materialDefaultFinish(), "Satin");
assert.deepEqual(materialSurface(custom, "Gloss"), materialSurface({ ...custom, name: "Nama diganti" }, "Gloss"), "Rendering does not depend on a known brand ID");
const gloss = materialSurface(custom, "Gloss");
const matte = materialSurface(custom, "Matte");
assert.ok(gloss.roughness < matte.roughness && gloss.clearcoat > matte.clearcoat, "Finish selection changes physical reflection parameters");
assert.ok(materialSurface({ name: "Chrome Film", type: "Vinyl" }, "Gloss").metalness > gloss.metalness, "Explicit chrome label uses a reflective simulation");
assert.equal(materialSurface({ name: "Chrome Film", type: "Vinyl" }, "Matte").roughness, matte.roughness, "Chosen finish remains authoritative");
console.log("Material preview passed: admin-created material labels, finish defaults, explicit finish overrides, brand-independent rendering and reflective surface profiles. Browser color/selection interaction remains separate.");
