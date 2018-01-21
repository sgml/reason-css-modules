const css = require("../css");

describe("extractClassNames", () => {
  it("should ignore global selector", () => {
    const content = `
      .root { color: red; }
      .test { color: blue; }
      :global(.abc) { color: white; }
    `;
    expect(css.extractClassNames(content)).toEqual(["root", "test"]);
  });

  it("should ignore id selector", () => {
    const content = `
      .root { color: red; }
      #foo { color: white; }
    `;
    expect(css.extractClassNames(content)).toEqual(["root"]);
  });
});
