/**
 * Created by lewis.knoxstreader on 21/09/16.
 */

$(document).ready(function() {
  console.log("WE IN IT");

  const fbid = $('.company-head').attr('id');

  $('input').focus(function() {
    $(`#button-${this.id}`).show();
  });

  // $('input').blur(function() {
  //   console.log("blurring");
  //   $(`#button-${this.id}`).hide();
  // });

  // process the form
  $('form').submit(function(event) {

    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)
    var formData = {
      fbid,
      id: $('input').id,
      _csrf: $('input[name=_csrf]').val()
    };

    console.log("formData =", formData);
    console.log("this =", this);

    $.ajax({
      type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url: '/company/' + fbid, // the url where we want to POST
      data: formData, // our data object
      encode: true,
      success(data) {
        console.log("SUCCESS");
        console.log(data);
      },
      error(smth, status, err) {
        console.error("ERROR IN AJAX", status);
        console.error("ERROR =", err);
      }
    })
    // using the done promise callback
      .done(function(data) {
        console.log("DONE", data);

        // location.reload();
      });

    // stop the form from submitting the normal way
    event.preventDefault();
  });

});
