import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import EventDispatcher from "../../event/@shared/event-dispatcher";
import CustomerAddressChangedEvent from "../../event/customer/customer-address-changed.event";
import CustomerCreatedEvent from "../../event/customer/customer-created.event";
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
  private _eventDispatcher: EventDispatcher;

  constructor(eventDispatcher: EventDispatcher = new EventDispatcher()) {
    this._eventDispatcher = eventDispatcher;
  }

  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
      id: entity.id,
      name: entity.name,
      street: entity.Address.street,
      number: entity.Address.number,
      zipcode: entity.Address.zip,
      city: entity.Address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    });
    const customerCreatedEvent = new CustomerCreatedEvent({});
    await this._eventDispatcher.notify(customerCreatedEvent);
  }

  async update(entity: Customer): Promise<void> {
    const beforeChanges = await this.find(entity.id);
    await CustomerModel.update(
      {
        name: entity.name,
        street: entity.Address.street,
        number: entity.Address.number,
        zipcode: entity.Address.zip,
        city: entity.Address.city,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints,
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
    if (entity.Address !== beforeChanges.Address) {
      const customerAddressChangedEvent = new CustomerAddressChangedEvent({
        id: entity.id,
        name: entity.name,
        address: `${entity.Address.street}, ${entity.Address.number}, ${entity.Address.city}, ${entity.Address.zip}`,
      });
      this._eventDispatcher.notify(customerAddressChangedEvent);
    }
  }

  async find(id: string): Promise<Customer> {
    let customerModel;
    try {
      customerModel = await CustomerModel.findOne({
        where: { id },
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Customer not found");
    }

    const customer = new Customer(id, customerModel.name);
    const address = new Address(
      customerModel.street,
      customerModel.number,
      customerModel.zipcode,
      customerModel.city
    );
    customer.changeAddress(address);

    return customer;
  }

  async findAll(): Promise<Customer[]> {
    const customerModels = await CustomerModel.findAll();
    const customers = customerModels.map((customerModel) => {
      let customer = new Customer(customerModel.id, customerModel.name);
      customer.addRewardPoints(customerModel.rewardPoints);
      const address = new Address(
        customerModel.street,
        customerModel.number,
        customerModel.zipcode,
        customerModel.city
      );
      customer.changeAddress(address);
      if (customerModel.active) {
        customer.activate();
      }
      return customer;
    });
    return customers;
  }
}
