import Product from "./product";

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      const product = new Product("", "name1", 10);
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      const product = new Product("123", "", 10);
    }).toThrowError("Name is required");
  });

  it("should throw error when price is less than zero", () => {
    expect(() => {
      const product = new Product("123", "nome", -1);
    }).toThrowError("Price must be greater than 0");
  });

  it("should change name", () => {
    const product = new Product("123", "nome", 10);
    product.changeName("newName");
    expect(product.name).toBe("newName");
  });

  it("should throw error when change name to empty", () => {
    const product = new Product("123", "nome1", 10);
    expect(() => {
      product.changeName("");
    }).toThrowError("Name is required");
  });

  it("should change price", () => {
    const product = new Product("123", "nome", 10);
    product.changePrice(100);
    expect(product.price).toBe(100);
  });

  it("should throw error when change price to less than zero", () => {
    const product = new Product("123", "nome1", 10);
    expect(() => {
      product.changePrice(-1);
    }).toThrowError("Price must be greater than 0");
  });
});
