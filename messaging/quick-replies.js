const menu = {
  content_type: "text",
  title: "Menu",
  payload: JSON.stringify({ intent: "MENU" })
};

const location = {
  content_type: "text",
  title: "Location",
  payload: JSON.stringify({ intent: "LOCATION" })
};

const hours = {
  content_type: "text",
  title: "Hours",
  payload: JSON.stringify({ intent: "HOURS" })
};

const myOrders = {
  content_type: "text",
  title: "My Orders",
  payload: JSON.stringify({ intent: "MY_ORDERS" })
};

const numbers = ['None', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

const quantity = (num, cost) => {
  return {
    content_type: "text",
    title: numbers[num] + ` for $${num * cost}`,
    payload: JSON.stringify({ intent: "QUANTITY", quantity: num })
  }
};

const quantityReplies = (cost) => [ quantity(1, cost), quantity(2, cost), quantity(3, cost), quantity(4, cost), quantity(5, cost), quantity(6, cost), quantity(7, cost), quantity(8, cost) ];

const basicReplies = [ menu, location, hours ];

const hoursReplies = [ menu, location, myOrders ];

module.exports = {
  menu,
  location,
  hours,
  myOrders,
  quantity,
  quantityReplies,
  basicReplies,
  hoursReplies
};
