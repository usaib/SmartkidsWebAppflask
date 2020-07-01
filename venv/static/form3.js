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
        tr.insertCell(-1).innerHTML="<button type='button' class='btn btn-warning' id='ed' onclick='openForm(this)'  >Edit</button>     <button class='btn btn-danger' id='del' type='button' onclick='myFunctiondel(this)'>Delete</button></td>";


    }
   
   
}
function myFunctiondel(element){
    debugger;
    x= element.closest('tr').rowIndex;
    stid=document.getElementById("class_table").rows[x].cells[4].innerHTML;
    $.ajax({
        method: "DELETE",
        url: "http://127.0.0.1:5000/delstudent/"+stid,
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
function myFunctionedit(){
    debugger;
    var newname = $('#newname').val();
	var newfathername = $('#newfathername').val();
    var newphone = $('#newphone').val();
    var newcnic=$('#newcnic').val();
    alert(newname);


    $.ajax({
        method: "PUT",
        url: "http://127.0.0.1:5000/updatestudent/"+stid,
        data:{
            "newname":newname,
            "newfathername":newfathername,
            "newphone":newphone,
            "newcnic":newcnic
            
        },
        dataType:"json",
        success: function (data){
            $('#myForm2').hide();

        },
        error: function (jqXHR, status, error) {
        },
        complete: function (jqXHR, status) {           
        }


    }); 

}
$(document).ready(function() {
    debugger;
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
        var tab=document.getElementById("class_sec");
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
    


});
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
            $('#myForm2').hide();
            tableforstudents(data,"class_table","students")

        },
        error: function (jqXHR, status, error) {
        },
        complete: function (jqXHR, status) {           
        }


    }); 
}