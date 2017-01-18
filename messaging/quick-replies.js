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

const quantity = (num) => {
  return {
    content_type: "text",
    title: numbers[num],
    payload: JSON.stringify({ intent: "QUANTITY", quantity: num })
  }
};

const quantityReplies = [ quantity(1), quantity(2), quantity(3), quantity(4), quantity(5), quantity(6), quantity(7), quantity(8) ];

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
