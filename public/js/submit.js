/**
 * Created by lewis.knoxstreader on 21/09/16.
 */

// using webpack to bundle all javascript together for one big file to send
window.jQuery = window.$ = require('./lib/jquery-2.1.3.min');
const _ = require('./lib/bootstrap.min');

console.log("PRIOR TO BEING IN IT");

$(document).ready(function() {
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

  $('button').click(function (event) {
    console.log("button click");
    console.log(this);

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
      type: 'POST',
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

  // process the form
  $('form').submit(function(event) {
    // stop the form from submitting the normal way
    event.preventDefault();

    console.log("in form submit jquery");

    const inputElems = $(`#${this.id} :text`);
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
      parentId: this.name,
      fbid
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
        case "price":
          sendData.price = values[x].val;
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

  // server can't deal with changing photos (client jquery code seems fine tho)
  //
  // $(':file').change(function (event) {
  //   console.log("THE element =", this);
  //   const elem = $(this).get(0);
  //   console.log("file", elem.files[0]);
  //   const multiPart = new FormData();
  //   multiPart.append('file', elem.files[0]);
  //
  //   return $.ajax({
  //     type: 'POST',
  //     url: '/company' + fbid + '/' + elem.id,
  //     data: multiPart,
  //     processData: false,
  //     contentType: false,
  //     success(data) {
  //       console.log("SUCCESS");
  //       console.log(data);
  //     },
  //     error(smth, status, err) {
  //       console.error("ERROR IN FILE UPLOAD", status);
  //       console.error("ERROR =", err);
  //     }
  //   })
  //     .done(data => console.log("DONE UPLOAD", data));
  //
  // });

});

$( function()
{
  var targets = $( '[rel~=tooltip]' ),
      target  = false,
      tooltip = false,
      title   = false;

  targets.bind( 'mouseenter', function()
  {
      target  = $( this );
      tip     = target.attr( 'title' );
      tooltip = $( '<div id="tooltip"></div>' );

      if( !tip || tip == '' )
          return false;

      target.removeAttr( 'title' );
      tooltip.css( 'opacity', 0 )
             .html( tip )
             .appendTo( 'body' );

      var init_tooltip = function()
      {
          if( $( window ).width() < tooltip.outerWidth() * 1.5 )
              tooltip.css( 'max-width', $( window ).width() / 2 );
          else
              tooltip.css( 'max-width', 340 );

          var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
              pos_top  = target.offset().top - tooltip.outerHeight() - 20;

          if( pos_left < 0 )
          {
              pos_left = target.offset().left + target.outerWidth() / 2 - 20;
              tooltip.addClass( 'left' );
          }
          else
              tooltip.removeClass( 'left' );

          if( pos_left + tooltip.outerWidth() > $( window ).width() )
          {
              pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
              tooltip.addClass( 'right' );
          }
          else
              tooltip.removeClass( 'right' );

          if( pos_top < 0 )
          {
              var pos_top  = target.offset().top + target.outerHeight();
              tooltip.addClass( 'top' );
          }
          else
              tooltip.removeClass( 'top' );

          tooltip.css( { left: pos_left, top: pos_top } )
                 .animate( { top: '+=10', opacity: 1 }, 50 );
      };

      init_tooltip();
      $( window ).resize( init_tooltip );

      var remove_tooltip = function()
      {
          tooltip.animate( { top: '-=10', opacity: 0 }, 50, function()
          {
              $( this ).remove();
          });

          target.attr( 'title', tip );
      };

      target.bind( 'mouseleave', remove_tooltip );
      tooltip.bind( 'click', remove_tooltip );
  });
});
