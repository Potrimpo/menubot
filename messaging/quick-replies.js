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

const basicReplies = [ menu, location, hours ];

const hoursReplies = [ menu, location, myOrders ];

module.exports = {
  menu,
  location,
  hours,
  myOrders,
  basicReplies,
  hoursReplies
};
