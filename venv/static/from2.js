function myFunctioneditclass(){
    debugger;
    var new_class_id_1= $('#new_class_id_1').val();
    var new_sec_id_1 = $('#new_sec_id_1').val();
    var new_room_no = $('#new_room_no').val();
    var new_strength = $('#new_strength').val();
    
    $.ajax({
        method: "PUT",
        url: "http://127.0.0.1:5000/updateclasssec/"+cl_id,
        data:{
            "new_class_id":new_class_id_1,
            "new_sec_id":new_sec_id_1,
            "new_room_no":new_room_no,
            "new_strength":new_strength,
        },
        dataType:"json",
        success: function (data){
            $('#myForm').hide();

        },
        error: function (jqXHR, status, error) {
        },
        complete: function (jqXHR, status) {           
        }


    }); 

}
function myFunction(element){
    debugger;
    x= element.closest('tr').rowIndex;
    tabID=element.closest('table').id;
    alert(x);
    alert(tabID);
    if (tabID=="create_class_table"){

        y=1;
    }
    else{
        y=0;
    }
    cl_id=document.getElementById(tabID).rows[x].cells[y].innerHTML;
    switch (tabID) {
        case "class_table":
          text = "delclass/";
          break;
        case "sec_table":
          text = "delsec/";
          break;

        case "create_class_table":
            text = "delclasssec/";
            break;
        default:
          text = "";
      }
    $.ajax({
        method: "DELETE",
        url: "http://127.0.0.1:5000/" +text+ cl_id,
        data:"",
        success: function (data){
             location.reload();
        },
        error: function (jqXHR, status, error) {
        },
        complete: function (jqXHR, status) {           
        }


    });  
}


function tableforclasses(jsonObject, element, label) {
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
        tr.insertCell(-1).innerHTML="<button type='button' class='btn btn-warning' id='ed' onclick='openForm(this)'  >Edit</button>     <button class='btn btn-danger' id='del' type='button' onclick='myFunction(this)'>Delete</button></td>";


    }
   
   
}

function all_classes(){
 
    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:5000/getclass_sec",
        data: "",
        dataType: 'json',
        success: function (data) {
            $('#partone').html("");
            $('#col2').remove();
            $('#parttwo').html("");
            $('#ClassTable').remove();
            $('#SecTable').remove();
            tableforclasses(data,"create_class_table","CLASS_Table")
        },
        error: function (jqXHR, status, error) {
            debugger;
        },
        complete: function (jqXHR, status) {
         
        }
    });
}
$(document).ready(function() {

    
    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:5000/getclasses",
        data: "",
        dataType: 'json',
        success: function (data) {
            tableforclasses(data,"class_table","classtable")
        },
        error: function (jqXHR, status, error) {
            debugger;
        },
        complete: function (jqXHR, status) {
         
        }
    });
    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:5000/getsections",
        data: "",
        dataType: 'json',
        success: function (data) {
            tableforclasses(data,"sec_table","SecTable")
        },
        error: function (jqXHR, status, error) {
            debugger;
        },
        complete: function (jqXHR, status) {
         
        }
    });


    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:5000/getclasses",
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
            var tab=document.getElementById("new_class_id_1");
            for (var i = 0; i < data.length+1; i++) {
                var opt = document.createElement('option');
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
    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:5000/getsections",
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
            var tab=document.getElementById("new_sec_id_1");
            for (var i = 0; i < data.length+1; i++) {
                var opt = document.createElement('option');
                opt.appendChild(document.createTextNode(data[i][col[1]]));
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
    


});