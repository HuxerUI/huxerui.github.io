import test from "node:test";
import assert from "node:assert/strict";
import { headerReviewHash, normalizeDeclaration, typeBody } from "../scripts/api-contract.mjs";

test("member contracts inspect the declared owner rather than another class in the header", () => {
  const source = "class Handle; class Installer { public: void OnActivation(int); }; class Handle { public: bool IsOpen() const; };";
  assert.match(typeBody(source, "Installer"), /OnActivation/);
  assert.doesNotMatch(typeBody(source, "Handle"), /OnActivation/);
  assert.match(typeBody(source, "Handle"), /IsOpen/);
});

test("header review detects additions within an existing public header", () => {
  const before = "class Handle { public: void Close(); };\n";
  const after = "class Handle { public: void Close(); void HideKeyboard(); };\n";
  assert.notEqual(headerReviewHash(before), headerReviewHash(after));
  assert.equal(headerReviewHash(before), headerReviewHash(before.replace(/\n/g, "\r\n")));
});

test("signature normalization preserves names and types while ignoring layout", () => {
  assert.equal(normalizeDeclaration("Task< Result<int> > Read( int count );"),
      normalizeDeclaration("Task<Result<int>> Read(int count);"));
  assert.notEqual(normalizeDeclaration("int Read(int count);"), normalizeDeclaration("void Read(int count);"));
});
