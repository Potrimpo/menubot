/**
 * Created by lewis.knoxstreader on 21/09/16.
 */

$(document).ready(function() {
  console.log("WE IN IT");

  // process the form
  $('form').submit(function(event) {

    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)
    var formData = {
      fbid: $('.company-head').attr('id'),
      id: $('input#id').val(),
      name : $('input[name=name]').val(),
      _csrf: $('input[name=_csrf]').val()
    };

    console.log("formData =", formData);

    // process the form
    $.ajax({
      type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url: '/company/' + formData.fbid, // the url where we want to POST
      data: formData, // our data object
      dataType: 'json', // what type of data do we expect back from the server
      encode: true
    })
    // using the done promise callback
      .done(function(data) {
        console.log("DONE");

        // log data to the console so we can see
        console.log(data);

        // here we will handle errors and validation messages
      });

    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();
  });

});
