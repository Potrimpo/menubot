/**
 * Created by lewis.knoxstreader on 14/12/16.
 */

const orderAttempt = {
  closed: "Sorry! We aren't open today!",
  open: "What time would you like that? (include am/pm)",
  tooLate: (open, close) => `Sorry! We're only open between ${open} and ${close} today!`,
  minimumWait: delay => `Sorry, it'll be at least ${delay} minutes before we can get that to you!`,
  noTime: "Sorry, we couldn't understand the time you gave us",
  error: "Sorry, we had some trouble processing that"
};

const hoursCheck = {
  open: (open, close) => `We're open between ${open} and ${close} today`,
  closed: "Sorry! We're not open today"
};

const locationCheck = {
  found: loc => `Currently: ${loc}`,
  notFound: "I don't know where I am!"
};

const confused = "Sorry, we couldn't understand that!";

const noOrders = "Oops! Looks like you don't have any orders";

module.exports = {
  orderAttempt,
  hoursCheck,
  locationCheck,
  noOrders,
  confused
};
