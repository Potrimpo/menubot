import { map, assoc, zipObj, compose, curry } from 'ramda'

//Adds the furl property to every entry in an array or object of entries
//Expects:
// entries: An object or array of entries. As only items and types have
//          children, only arrays/objects of items/types should be passed in.
export const addFurl = (entries) => map( (entry) => assoc('furl', false, entry), entries )

//Adds the makingNew property to every entry in an array or object of entries
//Expects:
// entries: An object or array of entries. As only items and types have
//          children, only arrays/objects of items/types should be passed in.
export const addMaking = (entries) => map( (entry) => assoc('makingNew', false, entry), entries )

//Applies the functions addFurl and addMaking to a list or object of entries
//Expects:
// entries: An object or array of entries. As only items and types have
//          children, only arrays/objects of items/types should be passed in.
export const addProps = compose(
  curry(addFurl),
  curry(addMaking)
)
