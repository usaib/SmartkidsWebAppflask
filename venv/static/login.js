$(document).ready(function() {


$('#submit').on('click', function(event){
    debugger;
    var username = $('#username').val();
	var password = $('#password').val();
        $.ajax({
            method: "POST",
            url: "http://127.0.0.1:5000/auth",
            data: {
               "username":username,
               "password":password
            },
            success: function (data){
                debugger;
            },
            error: function (jqXHR, status, error) {
                alert(error);
                debugger;
            },
            complete: function (jqXHR, status) {
             
            }


        });


   
});


});