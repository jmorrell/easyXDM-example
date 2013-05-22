var REMOTE = "https://" + document.location.hostname + ":8002";

var xhr = new easyXDM.Rpc({
  remote: REMOTE + '/cors/'
}, {
  remote: {
    request: {}
  }
});

function login(data, callback) {
  xhr.request({
    url: "../login",
    method: "POST",
    data: data
  }, callback);
}

$(function() {
  $('.btn-primary').on('click', function(ev) {
    ev.preventDefault();

    // get the data
    var email = $('#email').val();
    var pass = $('#password').val();

    if (email && pass) {
      login({ email: email, password: pass }, function(res) {
        if (res.status === 200) {
          $('.container').html("<p>You are now logged in as foo@bar.com. Hit refresh.</p>");
        }
      });
    }
    
  });
});
