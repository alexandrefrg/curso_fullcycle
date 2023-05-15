import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerRepository from "../../infrastructure/repository/customer.repository";
import EnviaConsoleLog1Handler from "../customer/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "../customer/handler/envia-console-log-2.handler";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";
import CustomerModel from "../../infrastructure/db/sequelize/model/customer.model";
import EnviaConsoleLogHandler from "../customer/handler/envia-console-log.handler";

describe("Event dispatcher unit tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      2
    );

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all eventHandlers when received an event", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should send two event when customer is created", async () => {
    let sequelize: Sequelize;
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();

    const eventDispatcher = new EventDispatcher();
    const Handler1 = new EnviaConsoleLog1Handler();
    const Handler2 = new EnviaConsoleLog2Handler();
    const spyEventHandler1 = jest.spyOn(Handler1, "handle");
    const spyEventHandler2 = jest.spyOn(Handler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", Handler1);
    eventDispatcher.register("CustomerCreatedEvent", Handler2);

    const customerRepository = new CustomerRepository(eventDispatcher);
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("street1", 1, "zip1", "city 1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();

    await sequelize.close;
  });

  it("should send an event when customer changed address", async () => {
    let sequelize: Sequelize;
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();

    const eventDispatcher = new EventDispatcher();
    const Handler = new EnviaConsoleLogHandler();
    const spyEventHandler = jest.spyOn(Handler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", Handler);

    const customerRepository = new CustomerRepository(eventDispatcher);
    const customer = new Customer("c1", "Customer 1");
    const address1 = new Address("street1", 1, "zip1", "city 1");
    customer.changeAddress(address1);
    await customerRepository.create(customer);

    const address2 = new Address("street2", 2, "zip2", "city 2");
    customer.changeAddress(address2);
    await customerRepository.update(customer);

    expect(spyEventHandler).toHaveBeenCalled();

    await sequelize.close;
  });
});
