import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      const order = new Order("", "123", []);
    }).toThrowError("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      const order = new Order("123", "", []);
    }).toThrowError("Id is required");
  });

  it("should throw error when Order items is empty", () => {
    expect(() => {
      const order = new Order("123", "123", []);
    }).toThrowError("Items are required");
  });

  it("should calculate total", () => {
    const item1 = new OrderItem("1", "item_nome", 10, "1", 2);
    const order1 = new Order("1", "123", [item1]);
    expect(order1.total()).toBe(20);

    const item2 = new OrderItem("1", "item_nome", 15, "2", 2);
    const order2 = new Order("1", "123", [item1, item2]);

    expect(order2.total()).toBe(50);
  });

  it("should throw error if the item quantity is less or equal zero", () => {
    expect(() => {
      const item = new OrderItem("1", "item_nome", 10, "1", 0);
      const order = new Order("1", "123", [item]);
    }).toThrowError("Quantity must be greater than 0");
  });
});
