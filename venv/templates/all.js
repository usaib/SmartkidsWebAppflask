$(document).ready(function() {
    function CreateTableFromJSON(jsonObject, element, label) {
        var col = [];
        for (var i = 0; i < jsonObject.length; i++) {
            for (var key in jsonObject[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }
        var table = document.getElementById("table");
        var tr = table.insertRow(-1);
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = col[i];
            tr.appendChild(th);
        }
        for (var i = 0; i < jsonObject.length; i++) {

            tr = table.insertRow(-1);
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = jsonObject[i][col[j]];

            }
            
        }
        
       
    }
    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:5000/registerdstudents",
        data: "",
        dataType: 'json',
        success: function (data) {
            CreateTableFromJSON(data,"table","Student Table")
        },
        error: function (jqXHR, status, error) {
            debugger;
        },
        complete: function (jqXHR, status) {
         
        }
    });





});