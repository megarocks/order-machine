const { Machine } = require("xstate");

const orderMachine = Machine({
  id: "order",
  initial: "idle",
  context: {
    _id: "123",
    userId: "777",
    products: ["123", "456"],
    shipmentCredentials: {},
    total: 888,
    createdAt: "today"
  },
  states: {
    idle: {
      on: {
        NEW_ORDER: "waitingForApproval"
      }
    },
    waitingForApproval: {
      on: {
        APPROVE: "waitingForPayment",
        CANCEL: "canceled"
      },
      actions: [
        "log",
        "saveOrderToDB",
        "notifyCustomerOrderCreated",
        "notifyAdminOrderCreated"
      ],
      cond: "orderDataIsValid"
    },
    waitingForPayment: {
      on: {
        PAYMENT: "waitingToBeSent",
        CANCEL: "canceled"
      },
      actions: [
        "saveOrderStateUpdateToDB",
        "notifyCustomerOrderPayed",
        "notifyAdminOrderPayed"
      ]
    },
    waitingToBeSent: {
      on: {
        SEND: "sentToCustomer"
      },
      actions: [
        "saveOrderStateUpdateToDB",
        "notifyCustomerOrderReadyToBeSent",
        "notifyAdminOrderReadyToBeSent"
      ]
    },
    sentToCustomer: {
      on: {
        COMPLETE: "completed"
      },
      actions: [
        "saveOrderStateUpdateToDB",
        "notifyCustomerOrderSent",
        "notifyAdminOrderSent"
      ]
    },
    completed: {
      type: "final",
      actions: [
        "saveOrderStateUpdateToDB",
        "notifyCustomerOrderCompleted",
        "notifyAdminOrderCompleted"
      ]
    },
    canceled: {
      type: "final",
      actions: [
        "saveOrderStateUpdateToDB",
        "notifyCustomerOrderCanceled",
        "notifyAdminOrderCanceled"
      ]
    }
  }
});

module.exports = orderMachine;
