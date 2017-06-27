// using webpack to bundle all javascript together for one big file to send
window.jQuery = window.$ = require('./lib/jquery-2.1.3.min');
const _ = require('./lib/bootstrap.min'),
  moment = require('./lib/moment-timezone-with-data-2010-2020.min.js');

import myQuote from './quotes';

$("[name='filterLink']").mouseup(function(){
    $(this).blur();
});

console.log("PRIOR TO BEING IN IT");

$(document).ready(function() {
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

  } else {
    const quoteRandom = Math.floor(Math.random()*myQuote.length);
    $('#myQuote').html(myQuote[quoteRandom]);
  }

  //yay for us
  console.log("WE IN IT");

  //initialising orders page guffery
  if(document.location.pathname.indexOf('/orders/') == 0) {
    $("[name='filterLink']").mouseup(function(){
      $(this).blur();
    });
  }

  //initialising landing page guffery
  if (window.location.pathname == '/landing') {

    if ($(window).width() < 992) {
      $('#landingText').hide();
    }

    if ($(window).width() < 768) {
      $('#authCodeForm1').hide();
      $('#authCodeForm2').show();
    }

    $("[name='hider-btn']").click(function () {
      const value = this.id;
      const hider = $(`[name=hider-content]#${value}`);
      if ( hider.is( ":hidden" ) ) {
        $(`[name='hider-btn']#${value}`).html('Hide details «');
        hider.slideDown();
      } else {
        $(`[name='hider-btn']#${value}`).html('View details »');
        hider.slideUp();
      }
    });

  }

  // document constants
  const fbid = $('.company-head').attr('id');


  //Initialise a new company
  $('form.company-init').submit(function(event) {
    event.preventDefault();

    //Define company Facebook id
    var fbid = this.id;

    //Find the client's current timezone
    var timezone = moment.tz.guess();

    $.ajax({
      type: 'POST',
      url: '/company/init/' + fbid,
      data: { timezone },
      encode: true,
      success(data) {
        console.log("SUCCESS");
        if (typeof data.redirect == 'string') {
          window.location = data.redirect
        };
      },
      error(smth, status, err) {
        console.error("ERROR IN AJAX", status);
        console.error("ERROR =", err);
      }
    })
      .done(function(data) {
        console.log("DONE");
      });
  });

});
