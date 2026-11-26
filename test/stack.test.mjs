import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

test("the frontend uses browser-native JavaScript without a framework script", () => {
  const scriptSources = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)]
    .map((match) => match[1]);

  assert.deepEqual(scriptSources, ["script.js"]);
});

test("the external icon library is pinned to Bootstrap Icons 1.11.3", () => {
  const externalStylesheets = [
    ...html.matchAll(/<link\b[^>]*\bhref=["'](https:\/\/[^"']+)["']/gi),
  ].map((match) => match[1]);

  assert.deepEqual(externalStylesheets, [
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
  ]);
});

test("the CI runtime is pinned to Node.js 24 and there are no runtime npm dependencies", () => {
  assert.equal(packageJson.engines.node, "24.x");
  assert.deepEqual(packageJson.dependencies ?? {}, {});
});
