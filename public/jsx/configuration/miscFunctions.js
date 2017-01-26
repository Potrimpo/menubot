import { map, assoc } from 'ramda'

//Adds the furl property to every entry in an array or object of entries
//Expects:
// entriesObject: An object or array of entries. As only items and types have
//                children, only arrays/objects of items/types should be passed
//                in
export const addFurl = (entriesObject) => map( (entry) => assoc('furl', false, entry), entriesObject )
