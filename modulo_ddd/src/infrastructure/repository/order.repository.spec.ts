import { Sequelize } from "sequelize-typescript";
import OrderModel from "../db/sequelize/model/order.model";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository unit tests", () => {
  let sequelize: Sequelize;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      OrderModel,
      CustomerModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close;
  });

  it("should create a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("street", 1, "zipcode", "city");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem("oi1", product.name, 20, product.id, 1);

    const order = new Order("o1", customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          product_id: orderItem.productId,
        },
      ],
    });
  });

  it("should update a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("street", 1, "zipcode", "city");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("p1", "Product 1", 100);
    await productRepository.create(product1);

    const orderItem1 = new OrderItem(
      "oi1",
      product1.name,
      product1.price,
      product1.id,
      2
    );

    const order1 = new Order("o1", customer.id, [orderItem1]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);
    const orderModel1 = await OrderModel.findOne({
      where: { id: order1.id },
      include: ["items"],
    });

    expect(orderModel1.toJSON()).toStrictEqual({
      id: order1.id,
      customer_id: order1.customerId,
      total: order1.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: order1.id,
          product_id: orderItem1.productId,
        },
      ],
    });

    const product2 = new Product("p2", "Product 2", 200);
    await productRepository.create(product2);
    const orderItem2 = new OrderItem("oi2", product2.name, 10, product2.id, 1);
    const order2 = new Order(order1.id, customer.id, [orderItem1, orderItem2]);

    await orderRepository.update(order2);
    const orderModel2 = await OrderModel.findOne({
      where: { id: order2.id },
      include: ["items"],
    });

    expect(orderModel2.toJSON()).toStrictEqual({
      id: order2.id,
      customer_id: order2.customerId,
      total: order2.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: order1.id,
          product_id: orderItem1.productId,
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: order1.id,
          product_id: orderItem2.productId,
        },
      ],
    });
  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("street", 1, "zipcode", "city");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem("oi1", product.name, 20, product.id, 1);

    const order = new Order("o1", customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find(order.id);

    expect(order).toStrictEqual(foundOrder);
  });

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();
    expect(async () => {
      await orderRepository.find("");
    }).rejects.toThrow("Order not found");
  });

  it("should find all order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("street", 1, "zipcode", "city");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 100);
    await productRepository.create(product);

    const orderRepository = new OrderRepository();

    const orderItem1 = new OrderItem(
      "oi1",
      product.name,
      product.price,
      product.id,
      1
    );
    const order1 = new Order("o1", customer.id, [orderItem1]);
    await orderRepository.create(order1);

    const orderItem2 = new OrderItem(
      "oi2",
      product.name,
      product.price,
      product.id,
      2
    );
    const order2 = new Order("o2", customer.id, [orderItem2]);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();

    expect(foundOrders).toHaveLength(2);
    expect(foundOrders).toContainEqual(order1);
    expect(foundOrders).toContainEqual(order2);
    expect(foundOrders).toEqual([order1, order2]);
  });
});
