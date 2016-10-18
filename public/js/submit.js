/**
 * Created by lewis.knoxstreader on 21/09/16.
 */

$(document).ready(function() {
  console.log("WE IN IT");

  // document constants
  const fbid = $('.company-head').attr('id');

  // $('input').focus(function() {
  //   console.log("button");
  //   console.log(this.name);
  //   $(`#button-${this.name}`).show();
  // });

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
