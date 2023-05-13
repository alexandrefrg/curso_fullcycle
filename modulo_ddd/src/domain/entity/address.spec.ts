import Address from "./address";

describe("Address unit tests", () => {
  it("should throw error when street is empty", () => {
    expect(() => {
      const address = new Address("", 0, "12345-678", "cidade");
    }).toThrowError("Street is required");
  });

  it("should throw error when zip code is empty", () => {
    expect(() => {
      const address = new Address("rua", 0, "", "cidade");
    }).toThrowError("Zip is required");
  });

  it("should throw error when city is empty", () => {
    expect(() => {
      const address = new Address("rua", 0, "12345-678", "");
    }).toThrowError("City is required");
  });

  it("should change street", () => {
    const address = new Address("street", 1, "zipcode", "city");
    address.changeStreet("newStreet");
    expect(address.street).toBe("newStreet");
  });

  it("should throw error when change street to empty", () => {
    const address = new Address("street", 1, "zipcode", "city");
    address.changeStreet("newStreet");
    expect(() => {
      const address = new Address("street", 1, "zip", "city");
      address.changeStreet("");
    }).toThrowError("Street is required");
  });

  it("should change City", () => {
    const address = new Address("street", 1, "zipcode", "city");
    address.changeCity("newCity");
    expect(address.city).toBe("newCity");
  });

  it("should throw error when change city to empty", () => {
    expect(() => {
      const address = new Address("street", 1, "zip", "city");
      address.changeCity("");
    }).toThrowError("City is required");
  });

  it("should change Zip", () => {
    const address = new Address("street", 1, "zipcode", "city");
    address.changeZip("newZip");
    expect(address.zip).toBe("newZip");
  });

  it("should throw error when change zip to empty", () => {
    expect(() => {
      const address = new Address("street", 1, "zip", "city");
      address.changeZip("");
    }).toThrowError("Zip is required");
  });
});
