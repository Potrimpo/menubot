/**
 * Created by lewis.knoxstreader on 26/10/16.
 */

exports.dateParsing = () => {
  const today = new Date();
  let dd = today.getDate(),
    mm = today.getMonth() + 1, //January is 0!
    yyyy = today.getFullYear();

  if(dd<10) {
    dd='0'+dd
  }

  if(mm<10) {
    mm='0'+mm
  }

  // start of the day (00's) & nz timezone (+13)
  return `${yyyy}-${mm}-${dd} 00:00:00+13`;
};
