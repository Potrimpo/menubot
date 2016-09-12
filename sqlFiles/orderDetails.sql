SELECT s.sizeid, s.typeid, t.itemid, s.size, type, item FROM sizes s
INNER JOIN types t ON s.typeid=t.typeid
INNER JOIN items i ON t.itemid=i.itemid
WHERE s.sizeid=$1