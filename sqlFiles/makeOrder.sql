INSERT INTO orders (fbid, userid, typeid, sizeid, pickuptime)
VALUES ($1, $2, $3, $4, $5)
RETURNING pickuptime
