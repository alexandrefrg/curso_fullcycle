import OrderItem from "./order_item";

describe("Order Item unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      const orderItem = new OrderItem("", "name", 1, "123", 1);
    }).toThrowError("Id is required");
  });

  it("should throw error when product id is empty", () => {
    expect(() => {
      const orderItem = new OrderItem("123", "name", 1, "", 1);
    }).toThrowError("ProductId is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      const orderItem = new OrderItem("123", "", 1, "123", 1);
    }).toThrowError("Name is required");
  });

  it("should throw error when price is less than 0", () => {
    expect(() => {
      const orderItem = new OrderItem("123", "name", -1, "123", 1);
    }).toThrowError("Price must be greater than 0");
  });

  it("should throw error when quantity is less than 0", () => {
    expect(() => {
      const orderItem = new OrderItem("123", "name", 1, "123", -1);
    }).toThrowError("Quantity must be greater than 0");
  });

  it("should calculate order item total", () => {
    const orderitem = new OrderItem("1", "name", 10, "123", 5);
    expect(orderitem.orderItemTotal()).toBe(50);
  });
});
