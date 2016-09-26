/**
 * Created by lewis.knoxstreader on 21/09/16.
 */

$(document).ready(function() {
  console.log("WE IN IT");

  const fbid = $('.company-head').attr('id'),
    _csrf = $('input[name=_csrf]').val();

  $('input').focus(function() {
    $(`#button-${this.id}`).show();
  });

  // process the form
  $('form').submit(function(event) {

    const inputElems = $(`#${this.id} :input.menu`);
    const values = $(inputElems).map(function() {
      return {
        id: this.id,
        val: $(this).val()
      };
    }).get();
    console.log("VALUES", values);

    const sendData = {};
    for (let x = values.length - 1; x >= 0; x--) {
      switch (values[x].id) {
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

    var formData = {
      fbid,
      sendData,
      _csrf
    };

    $.ajax({
      type: 'POST',
      url: '/company/' + fbid,
      data: formData,
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

  // server can't deal with changing photos (client jquery code seems find tho)
  $(':file').change(function (event) {
    console.log("THE element =", this);
    const elem = $(this).get(0);
    console.log("file", elem.files[0]);
    const idk = new FormData();
    idk.append('file', elem.files[0]);
    idk.append('_csrf', _csrf);

    return $.ajax({
      type: 'POST',
      url: '/company' + fbid + '/' + elem.id,
      data: idk,
      processData: false,
      contentType: false,
      success(data) {
        console.log("SUCCESS");
        console.log(data);
      },
      error(smth, status, err) {
        console.error("ERROR IN FILE UPLOAD", status);
        console.error("ERROR =", err);
      }
    })
      .done(data => console.log("DONE UPLOAD", data));

  });

});
