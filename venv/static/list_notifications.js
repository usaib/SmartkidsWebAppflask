function tablefornotifications(jsonObject, element, label) {
    var col = [];
    for (var i = 0; i < jsonObject.length; i++) {
        for (var key in jsonObject[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
        }
    var table = document.getElementById(element);
    var tr = table.insertRow(-1);
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    for (var i = 0; i < jsonObject.length; i++) {
        debugger;

        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = jsonObject[i][col[j]];

        }
       
    }
   /*  debugger;
    table.rows[0].id="news";
    table.rows[1].id="demo";
    table.rows[1].className="collapse"
    table.rows[0].className = "header";
    $("#news").attr("data-toggle", "collapse");
    $("#news").attr("data-target", "#demo");
    for (var j = 1; j < jsonObject.length; j++) {
        
        table.rows[j].className = "header";
    } */
   
   
}
$(document).ready(function() {

    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:5000/getnotifications",
        data: "",
        dataType: 'json',
        success: function (data) {
            debugger;
            tablefornotifications(data,"create_notification_table","Notif_Table")
        },
        error: function (jqXHR, status, error) {
            debugger;
        },
        complete: function (jqXHR, status) {
         
        }
    });
});