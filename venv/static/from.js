
function myFunction(element){
    debugger;
    x= element.closest('tr').rowIndex;
    stid=document.getElementById("studentTable").rows[x].cells[4].innerHTML;
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

    function Create_Class(){
        debugger;
        var class_id = $('#class_id').val();
        var class_name = $('#class_name').val();
        var roman_name = $('#roman_name').val();
    
    
        $.ajax({
            method: "POST",
            url: "http://127.0.0.1:5000/createclass",
            data:{
                "class_id":class_id,
                "class_name":class_name,
                "roman_name":roman_name
            },
            dataType:"json",
            success: function (data){
                $('#myForm3').hide();
    
            },
            error: function (jqXHR, status, error) {
            },
            complete: function (jqXHR, status) {           
            }
    
    
        }); 
}
function Create_Section(){
    debugger;
    var sec_id = $('#sec_id').val();
    var sec_name = $('#sec_name').val();


    $.ajax({
        method: "POST",
        url: "http://127.0.0.1:5000/createsection",
        data:{
            "sec_id":sec_id,
            "sec_name":sec_name
        },
        dataType:"json",
        success: function (data){
            $('#myForm4').hide();

        },
        error: function (jqXHR, status, error) {
        },
        complete: function (jqXHR, status) {           
        }


    }); 
}
function Class_Name(){
    debugger;
    var class_id_1= $('#class_id_1').val();
    var sec_id_1 = $('#sec_id_1').val();
    var room_no = $('#room_no').val();
    var strength = $('#strength').val();
    var class_sec_bridge_id = $('#class_sec_bridge_id').val();


    $.ajax({
        method: "POST",
        url: "http://127.0.0.1:5000/classname",
        data:{
            "class_id":class_id_1,
            "sec_id":sec_id_1,
            "room_no":room_no,
            "strength":strength,
            "class_sec_bridge_id":class_sec_bridge_id
        },
        dataType:"json",
        success: function (data){
            $('#myForm5').hide();

        },
        error: function (jqXHR, status, error) {
        },
        complete: function (jqXHR, status) {           
        }


    }); 
}

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
        var table = document.getElementById("studentTable");
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
            tr.insertCell(5).innerHTML="<button type='button' class='btn btn-warning' id='ed' onclick='openForm2(this)'  >Edit</button>     <button class='btn btn-danger' id='del' type='button' onclick='myFunction(this)'>Delete</button></td>";


        }
        
       
       
    }
    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:5000/allstudents",
        data: "",
        dataType: 'json',
        success: function (data) {
            CreateTableFromJSON(data,"studentTableDiv","Student Table")
        },
        error: function (jqXHR, status, error) {
            debugger;
        },
        complete: function (jqXHR, status) {
         
        }
    });
    $('#submit').on('click', function(event){
        debugger;
        var name = $('#name').val();
		var fathername = $('#fathername').val();
        var phone = $('#phone').val();
        var cnic=$('#cnic').val();
        var class_sec=$('#class_sec').val();
        if(fathername != "" && name != "" && phone != ""){
            $.ajax({
                method: "POST",
                url: "http://127.0.0.1:5000/students",
                data: {
                    "name":name,
                    "fathername":fathername,
                    "phone":phone,
                    "cnic":cnic,
                    "class_sec":class_sec
                },
                dataType:"json",
                success: function (data){
                    debugger;
                    $('#myForm').hide();

                },
                error: function (jqXHR, status, error) {
                    debugger;
                },
                complete: function (jqXHR, status) {
                 
                }


            });


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
        var tab=document.getElementById("class_id_1");
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
        var tab=document.getElementById("sec_id_1");
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
