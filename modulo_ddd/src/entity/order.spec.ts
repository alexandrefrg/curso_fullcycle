import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "123", []);
    }).toThrowError("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "", []);
    }).toThrowError("Id is required");
  });

  it("should throw error when Order items is empty", () => {
    expect(() => {
      let order = new Order("123", "123", []);
    }).toThrowError("Items are required");
  });

  it("should calculate total", () => {
    const item1 = new OrderItem("1", "item_nome", 10);
    const item2 = new OrderItem("1", "item_nome", 15);
    const order = new Order("1", "123", [item1, item2]);

    expect(order.total()).toBe(25);
  });
});
