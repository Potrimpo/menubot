/**
 * Created by lewis.knoxstreader on 21/09/16.
 */

// using webpack to bundle all javascript together for one big file to send
window.jQuery = window.$ = require('./lib/jquery-2.1.3.min');
const _ = require('./lib/bootstrap.min');

console.log("PRIOR TO BEING IN IT");

$(document).ready(function() {
  $('#spinner-overlay').hide();
  $('body').removeClass('overlay-container')

  // dumb Footer quote generator
  var myQuote = [
    "&quot;And into this website he poured all his cruelty, his malice and his will to dominate all life&quot; - ",
    "Constructed mostly from crayons and construction paper by ",
    "Put together by ",
    "By ",
    "Designed by ",
    "Made by ",
    "Developed by ",
    "Fabricated by ",
    "Erected to appease pagan deity ",
    "1000 monkeys with 1000 type writers owned by ",
    "Means of production seized by ",
    "Put together by ",
    "Hastily cobbled together by ",
    "Hastily replated from floor by ",
    "Brewed from knockbox waste by ",
    "Ironically designed by ",
    "Written by ",
    "Manufactured by ",
    "Powered by ",
    "Assembled by ",
    "Completed by ",
    "Step one in world domination by ",
    "Raised in the name of ",
    "Laundering by ",
    "Blood, sweat and tears by ",
    "Lovingly crafted by "
  ];
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

  } else {
    var quoteRandom = Math.floor(Math.random()*myQuote.length);
    $('#myQuote').html(myQuote[quoteRandom]);
  }

  console.log("WE IN IT");

  // document constants
  const fbid = $('.company-head').attr('id');

  // delete a menu entry
  $('button.delete-entry').click(function (event) {
    console.log("button click");
    console.log(this);
    event.preventDefault();
    showSpinner();

    const [_, type, deleteId] = /(\w+)-(\d+)/.exec(this.name);
    console.log("type =", type);
    console.log("id =", deleteId);
    const deleteSpec = {
      intent: "delete",
      type,
      deleteId,
      fbid,
    };

    $.ajax({
      type: 'DELETE',
      url: '/company/' + fbid,
      data: deleteSpec,
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
      .done(function(data) {
        console.log("DONE", data);

        location.reload();
      });

  });

  // setting the company location
  $('form#location-setter').submit(function (event) {
    event.preventDefault();
    showSpinner();

    const locVal = $(this).find('input').val();

    $.ajax({
      type: 'POST',
      url: '/company/location/' + fbid,
      data: { id: fbid, location: locVal },
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
      .done(function(data) {
        console.log("DONE", data);

        location.reload();
      });

  });

  // update entry price
  $('form.price').submit(function (event) {
    event.preventDefault();
    showSpinner();

    const val = $(`#${this.id}`).find(':text').val(),
      id = this.id,
      kind = this.name;

    const data = {
      price: val,
      kind,
      id
    };

    $.ajax({
      type: 'PUT',
      url: '/company/' + fbid,
      data,
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
      .done(function(data) {
        console.log("DONE", data);
        location.reload();
      });
  });

  // process the form
  $('form.menu-entry').submit(function(event) {
    // stop the form from submitting the normal way
    event.preventDefault();
    showSpinner();

    const inputElems = $(`#${this.id}`).find(':text');
    const values = $(inputElems).map(function() {
      console.log("val name =", this.name);
      console.log("this =", this);
      return {
        kind: this.name,
        val: $(this).val()
      };
    }).get();

    const intent = /-(\w+)/.exec(this.id)[1];
    const sendData = {
      intent,
      fbid,
      parentId: this.name
    };

    for (let x = values.length - 1; x >= 0; x--) {
      switch (values[x].kind) {
        case "item":
          sendData.item = values[x].val;
          break;
        case "type":
          sendData.type = values[x].val;
          break;
        case "size":
          sendData.size = values[x].val;
          break;
      }
    }
    console.log("SENDING", sendData);

    $.ajax({
      type: 'POST',
      url: '/company/' + fbid,
      data: sendData,
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
      .done(function(data) {
        console.log("DONE", data);
        location.reload();
      });
  });

  $('.misc-async').click(function () {
    showSpinner();
  });

});

function showSpinner () {
  $('html,body').scrollTop(0);
  $('#spinner-overlay').show();
  $('body').addClass('overlay-container');
}


