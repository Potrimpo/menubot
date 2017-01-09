import { propEq, filter, isEmpty, append, insert, indexOf, last, head } from 'ramda'

const matchUserAndTime = (x, y) =>
x.customer_id == y.customer_id && x.pickuptime == y.pickuptime;

const findNewOrderLocation = (orderArray, newOrder) => {

  //If there are no orders in the orderArray, append the newOrder and return
  if (isEmpty(orderArray)) {
    const newOrderArray = append(newOrder, orderArray);
    return newOrderArray;
  }

  const sameTime = propEq('pickuptime', newOrder.pickuptime);
  const sameTimeOrders = filter(sameTime, orderArray);
  //If no existing orders have the same pickuptime as the new order:
  if (isEmpty(sameTimeOrders)) {

    const TimeLTInserted = insertWhereTimeLT(orderArray, newOrder);
    //Insert at the index of the first order that is sooner than the new order and return
    if (TimeLTInserted != null) {
      const newOrderArray = TimeLTInserted;
      return newOrderArray;
    } else {
      //If this order has the latest pickuptime, append it and return
      const newOrderArray = append(newOrder, orderArray);
      return newOrderArray;
    }

  } else {
    const sameCustId = propEq('customer_id', newOrder.customer_id)
    const sameCustOrders = filter(sameCustId, sameTimeOrders)
    //If no existing orders with the same pickuptime as the new order have the same customer_id:
    if (isEmpty(sameCustOrders)) {
      //Insert at the index of the last order that has the same pickuptime and return
      const indexOfLastSTO = indexOf((last(sameTimeOrders)), orderArray) + 1;
      const newOrderArray = insert(indexOfLastSTO, newOrder, orderArray);
      return newOrderArray;
    } else {
      //Else insert at index of first order that has same pickuptime and customer_id and return
      const indexOfLastSCO = indexOf(head(sameCustOrders), orderArray);
      const newOrderArray = insert(indexOfLastSCO, newOrder, orderArray);
      return newOrderArray;
    }
  }
};

const insertWhereTimeLT = (orderArray, newOrder) => {
  for (let j = 0; j < orderArray.length; j++) {
    if (new Date(newOrder.pickuptime) <= new Date(orderArray[j].pickuptime)) {
      return insert(j, newOrder, orderArray)
    }
  }
};


module.exports = {
  matchUserAndTime,
  findNewOrderLocation
};
