import { map, assoc, zipObj, compose, curry, lensPath } from 'ramda'

//Adds the furl property to every entry in an array or object of entries
//Expects:
// entries: An object or array of entries. As only items and types have
//          children, only arrays/objects of items/types should be passed in.
const addFurl = (entries) => map( (entry) => assoc('furl', false, entry), entries )

//Adds the makingNew property to every entry in an array or object of entries
//Expects:
// entries: An object or array of entries. As only items and types have
//          children, only arrays/objects of items/types should be passed in.
const addMaking = (entries) => map( (entry) => assoc('makingNew', false, entry), entries )

//Adds the makingNew property to every entry in an array or object of entries
//Expects:
// entries: An object or array of entries.
const addEditing = (entries) => map( (entry) => assoc('editing', false, entry), entries )

export const addItemProps = compose(
  curry(addFurl),
  curry(addMaking),
  curry(addEditing)
)

export const addTypeProps = compose(
  curry(addFurl),
  curry(addMaking),
  curry(addEditing)
)

export const addSizeProps = compose(
  curry(addEditing)
)

//A lens on entry properties, used in setting entry properties
//expects:
//  index: The index of the entry (itemid, typeid, sizeid),
//  property: The property of the entry to be changed. (item_price, type_photo, size)
export const entryProperty = (index, property) => lensPath([index, property]);
