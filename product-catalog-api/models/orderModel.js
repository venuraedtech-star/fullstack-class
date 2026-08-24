const prisma = require("../config/prisma");

function serializeOrder(order) {
  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    items: order.items?.map((item) => ({ ...item, price: Number(item.price) })),
  };
}

async function create(userId, { items, totalAmount, address, paymentMethod }) {
  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      paymentMethod,
      fullName: address.fullName,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      zip: address.zip,
      phone: address.phone,
      items: {
        create: items.map((item) => ({
          externalProductId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl ?? null,
        })),
      },
    },
    include: { items: true },
  });
  return serializeOrder(order);
}

async function getAll() {
  const orders = await prisma.order.findMany({
    include: { items: true, user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
  return orders.map(serializeOrder);
}

async function findById(id) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: { select: { id: true, name: true, email: true } } },
  });
  return order ? serializeOrder(order) : undefined;
}

module.exports = { create, getAll, findById };
