function toggle(source) {
    checkboxes = document.getElementsByName('checks');
    for(var i=0, n=checkboxes.length;i<n;i++) {
      checkboxes[i].checked = source.checked;
    }
  }
function tableforstudents(jsonObject, element, label) {
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
    var nth=document.createElement('th');
    nth.innerHTML="Action";
    tr.appendChild(nth)
    for (var i = 0; i < jsonObject.length; i++) {

        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = jsonObject[i][col[j]];

        }
        var newCheckBox = document.createElement('input');
        newCheckBox.type = 'checkbox';
        newCheckBox.name='checks';
        newCheckBox.className='checks';
        newCheckBox.value=jsonObject[i][col[4]];
        tr.insertCell(-1).appendChild(newCheckBox);
        

    }
   
   
}
function display_students(){
    debugger;
    $("#class_table").html("");
    var classes_sections= $('#classes_sections').val();
    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:5000/getstudentbyclass/"+classes_sections,
        data:{},
        dataType:"json",
        success: function (data){
            $('#myForm').hide();
            tableforstudents(data,"class_table","students")
            table=document.getElementById("class_table");
            for (var i = 1; i < data.length+1; i++) {
                tr = table.insertRow(-1);
            table.rows[i].className = "collapsable";
            }
            $('#checkbox').show();
            $('#select').show();
            $('#buttonshow').show();
            
        },
        error: function (jqXHR, status, error) {
        },
        complete: function (jqXHR, status) {           
        }


    }); 
}


function send_notification(){
    debugger;

    var time = $('#time').val();
    var title = $('#title').val();
    var description = $('#description').val();
    var checks = [];
            $.each($("input[name='checks']:checked"), function(){
             checks.push($(this).val());
            });
    
    
    $.ajax({
        method: "POST",
        url: "http://127.0.0.1:5000/create_notification",
        data:{
            
            "time":time,
            "title":title,
            "description":description,
            "checks":checks,
        },
        dataType:"json",
        success: function (data){
            alert('message send successfully');
            location.reload();

        },
        error: function (jqXHR, status, error) {
            alert('message not send successfully');   
        },
        complete: function (jqXHR, status) {           
        }


    }); 
}

function send_notification_to_all(){
    debugger;

    var time = $('#time').val();
    var title = $('#title').val();
    var description = $('#description').val();
    
    $.ajax({
        method: "POST",
        url: "http://127.0.0.1:5000/send_notification_to_all",
        data:{
            
            "time":time,
            "title":title,
            "description":description,
        },
        dataType:"json",
        success: function (data){
            alert('message send successfully');
            location.reload();

        },
        error: function (jqXHR, status, error) {
            alert('message not send successfully');   
        },
        complete: function (jqXHR, status) {           
        }


    }); 
}




$(document).ready(function() {
    $('#checkbox').hide();
    $('#select').hide();
    $('#buttonshow').hide();
    
    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:5000/displayclassessec",
        data: "",
        dataType: 'json',
        success: function (data) {
            var col = [];
            debugger;
            for (var i = 0; i < data.length; i++) {
                for (var key in data[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
                debugger;
            }
            debugger;
            var tab=document.getElementById("classes_sections");
            for (var i = 0; i < data.length+1; i++) {
                var opt = document.createElement('option');
                opt.appendChild(document.createTextNode(data[i][col[1]]));
                opt.append('-');
                opt.appendChild(document.createTextNode(data[i][col[2]]));
                        opt.value = data[i][col[0]];
                        tab.appendChild(opt); 
            }
    
    
        },
        error: function (jqXHR, status, error) {
            debugger;
        },
        complete: function (jqXHR, status) {
         
        }
        
    });
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); 
    var year = currentDate.getFullYear();
    var monthDateYear  = (month+1) + "/" + date + "/" + year;
    time=document.getElementById('time');
    time.value=monthDateYear;
    $('#buttonshow').on("click", function()
{
    $(".collapsable").slideToggle();
});

});