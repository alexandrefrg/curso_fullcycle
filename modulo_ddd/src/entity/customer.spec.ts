import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "Nome");
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "");
    }).toThrowError("Name is required");
  });

  it("should change name", () => {
    const customer = new Customer("123", "Nome");
    customer.changeName("Jane");

    expect(customer.name).toBe("Jane");
  });

  it("should throw error when change name to empty", () => {
    const customer = new Customer("123", "Nome");
    expect(() => {
      customer.changeName("");
    }).toThrowError("Name is required");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Nome");
    const address = new Address("Street", 2, "12345-678", "City");
    customer.Address = address;

    customer.activate();
    expect(customer.isActive()).toBe(true);
  });

  it("should throw error when try to activate customer without Address", () => {
    const customer = new Customer("1", "Nome");

    expect(() => {
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Nome");
    const address = new Address("Street", 2, "12345-678", "City");
    customer.Address = address;

    customer.deactivate();
    expect(customer.isActive()).toBe(false);
  });
});
