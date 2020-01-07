/*
TO DO:
    Need to tie detachments into each days view
    Need to properly assign ops schedule days to correct days
    Need to develop means of changing maintenance dates
    

*/
//switchsquadron populates several data elements on homepage
function switchsquadronData() {
    var squadron_selected = squadron_select.value;
    var squadron_string = JSON.stringify((squadron_selected));
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            output = new Array();
            output = JSON.parse(xhttp.responseText);
            document.getElementById('sqd_image').src = output[2];
            document.getElementById('assigned_aircraft_output').innerHTML=output[1];
            document.getElementById("aircraft_ops_need_output").innerHTML='-';  //output[6];
            document.getElementById("mc_aircraft_output").innerHTML= '-'; //output[7];
            document.getElementById("aircraft_det_output").innerHTML='-';  //output[5];
            document.getElementById("aircraft_in_mx_out").innerHTML='-';  //output[4];
            if(output[6] < output[7]){
                //document.getElementById("mc_aircraft_output").style.backgroundColor="green";
            }
            //alert(output[3]);
            //alert(output[[][0]]);
        }
    }
    xhttp.open("POST", "populatedataquery.php", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    //xhttp.send(json_encode(squadron_string));
    xhttp.send(JSON.stringify(squadron_string));
    loadOpsDetails()
    $('#opsCalendarspinners').html('');
}
//Need to be able to dynamically populate the SQD select to allow for other TMS
function populateSqdDropdown(){
    var xhttp = new XMLHttpRequest();
    instantiateBunoDroppable();
    hideOpsCalendar();
    $('#accordion').accordion();
    $('#accordion').accordion("option", "autoHeight", false);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            output_array = new Array();
            output_array = JSON.parse(xhttp.responseText);
            var node = document.getElementById("squadron_select");
            for(i = 0 ; i< output_array.length ; ++i){
                node.insertAdjacentHTML('beforeend', '<option>'+output_array[i]+'</option>');
            }

        }
    };
    xhttp.open("GET", "squadronquery.php", true);
    xhttp.send();
}
//Function to populate the calendar area, will be called simultaneously with the switch squadron function using a
// controller function.
function populatecalendar(){
    var squadron_selected = squadron_select.value;
    var squadron_string = JSON.stringify((squadron_selected));
    let xhttp = new XMLHttpRequest();
    let className = "calendarElement";
    let mxNameArray = new Array;
    mxNameArray= ['14 Day','28 Day','84 Day','112 Day', '168 Day', '336 Day', '365 Day', '728 Day'];
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            let mcCounter = new Array();
            for (x = 0; x < 38; ++x) {
                mcCounter[x] = 0;
                //console.log(mcCounter[x]+x);
            }
            let output_array = new Array();
            output_array = JSON.parse(xhttp.responseText);
            //console.log(output_array);
            var newnode = document.getElementById("buno_display");
            let detachmentNodeBunos = $('#bunoDraggables');
            var loop_counter = output_array.length;
            var mxEventsDueArray = new Array;
            var assignedACnode = document.getElementById('assigned_aircraft_output');
            assignedACnode.innerHTML = loop_counter;
            for (i = 0; i < loop_counter; ++i) {
                newnode = document.getElementById("buno_display");
                newnode.insertAdjacentHTML("beforeend", '<div class="bunodiv" data-value ='
                    + output_array[i][0] + ' id = ' + output_array[i][0] + 'onclick= "getid()" > <br>'
                    + output_array[i][0] + '</div>');
                detachmentNodeBunos.append('<div class="bunodivDraggable" data-value ='
                    + output_array[i][0] + ' id =BUNO'+i + /*output_array[i][0] +*/ ' onclick= "getid()" ><br>'
                    + output_array[i][0] + '</div>');
                $('#BUNO'+i/*+output_array[i][0]*/+'').data('BUNO', output_array[i][0]);
                $('.bunodivDraggable').draggable({snap:'#bunoDroppable'});
                let highestMxItem = 0;
                let todayDate = moment().format('YYYY-MM-DD');
                let dayCounter = 0;
                let mcCounterIncrement = 0;
                let buno = output_array[i][0];
                    for(e= -2; e<36; ++e){
                        $("#date"+e).data('Buno'+i, buno)
                    }
                for (j = -2; j < 36; ++j) {
                    mxEventsDueArray = [];
                    let output_string = "NO-MX";
                    className = "calendarElement";

                    for (n = 2; n < 12; ++n) {
                        if (todayDate == output_array[i][n]) {
                            mxEventsDueArray.push(n);
                            $("#date" + j).data('mxitem' + n + buno, n);
                        }
                    }


                    highestMxItem = Math.max(mxEventsDueArray);
                    for (t = 0; t < mxEventsDueArray.length; ++t) {
                        let mxItem = mxEventsDueArray[t];
                        if (mxItem == 3 || mxItem == 5 || mxItem == 7 || mxItem == 9 || mxItem == 11) {
                            className = "longMxCalendarElement";
                            dayCounter = 3;
                            break;
                        } else if (mxItem == 2 || mxItem == 4 || mxItem == 6 || mxItem == 8 || mxItem == 10) {
                            className = "mxCalendarElement";
                            dayCounter = 4;
                        }
                    }

                    if (dayCounter > 0 && dayCounter < 4) {
                        className = "longMxCalendarElement";
                        dayCounter = dayCounter - 1;
                        output_string = 'NMCM-S';
                        mcCounterIncrement = 0;
                    } else if (dayCounter == 4) {
                        className = 'mxCalendarElement';
                        dayCounter = 0;
                        output_string = 'MC-MX';
                        mcCounterIncrement = 1;
                    } else {
                        className = 'calendarElement';
                        output_string = 'MC';
                        mcCounterIncrement = 1;
                    }

                    if (mcCounterIncrement == 1) {
                        mcCounter[j+2] += 1;

                    }
                    newnode = document.getElementById("mxDisplay");
                    newnode.insertAdjacentHTML("beforeend", '<div class =' + className + ' ><br>'
                        + output_string + '</div>');
                    todayDate = moment().add(j, 'days').format('YYYY-MM-DD');

                }
                newnode.insertAdjacentHTML("beforeend", '<br>');

                for (days = -2; days < 36; ++days) {
                    let mcACFT = mcCounter[days+2];
                    //console.log(mcCounter[days]);
                    $("#date" +days).data('MC', mcACFT);
                    $("#date"+days).data('assignedAcft', loop_counter);
                }

                document.getElementById("mc_aircraft_output").innerHTML = '' + mcCounter[1] + '';


            }


            }

        };


    xhttp.open("POST", "calendarquery.php", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    //xhttp.send(json_encode(squadron_string));
    xhttp.send(JSON.stringify(squadron_string));

};
function populateSpinners(){

}
function getid(){
    $('#accordion').accordion();
    $('#maintenanceItemList').html('');
    event.target.getAttribute('id');
    var id = event.target.getAttribute('id');
    var n = id.length;
    if(n==5){
        var idNumber= id.substring(4,5);
    }else if(n == 6){
        idNumber= id.substring(4,6);
    }
    var idnumber2 = parseInt(idNumber);
    let mcOutputInfo = $('#date'+idnumber2).data('MC');
    let assignedAcft = $('#date'+idnumber2).data('assignedAcft');
    let aircraftDownMX = assignedAcft-mcOutputInfo;
    $("#mc_aircraft_output").html(mcOutputInfo);
    $("#assigned_aircraft_output").html(assignedAcft);
    $('#aircraft_in_mx_out').html(aircraftDownMX);
    var spinner = $('#spinner'+idNumber).spinner();
    let opsNeededPlanes = spinner.val();
    //console.log($('#sqd_image').data('lastClickedId'));
    let lastId = $('#sqd_image').data('lastClickedId');
    //lastId = '#date'+lastId;
    //lastId = String(lastId)
    console.log(lastId);
    $('#date'+idnumber2).css('color', 'Yellow');
    //$('#date'+idnumber2).css('background-color', 'green');
    $('#date'+lastId).css('color', 'white');
    $('#sqd_image').data('lastClickedId', idnumber2);
    $('#aircraft_ops_need_output').html(opsNeededPlanes);
    let mxNameArray= ['','','14 Day','28 Day','84 Day','112 Day', '168 Day', '336 Day', '365 Day', '728 Day', '14 Day', '28 Day'];
    if(mcOutputInfo<opsNeededPlanes){
        $('#mc_aircraft_output').css('color', 'red');
        $('#aircraft_ops_need_output').css('color', 'red');
    } else if (mcOutputInfo>opsNeededPlanes){
        $('#mc_aircraft_output').css('color', 'green');
        $('#aircraft_ops_need_output').css('color', 'green');
    }else{
        $('#mc_aircraft_output').css('color', 'yellow');
        $('#aircraft_ops_need_output').css('color', 'yellow');
    }
    if(aircraftDownMX >1){
        $('#aircraft_in_mx_out').css('color','red');
    }else{
        $('#aircraft_in_mx_out').css('color','green');
    }

    for(x=0; x<assignedAcft; ++x) {
        let buno = $('#date' + idnumber2).data('Buno' + x);
        $('#maintenanceItemList').append('<div class=bunolist id = MIL'+buno+'>' + buno + '</div><br>');

    }

    for(x=0; x<assignedAcft; ++x) {
        let buno = $('#date' + idnumber2).data('Buno' + x);
        for (i = 2; i < 12; ++i) {
            let mxitemnumber = $('#date' + idnumber2).data('mxitem' + i + buno);
            if(mxitemnumber>0) {
                let mxname=mxNameArray[mxitemnumber];
                $("#MIL"+buno).append('<div>'+mxname+'</div><br>');
            }
        }
    }

}
function addDates() {
    var dateConverted = new Date();
    var todayDate = moment().add(-3,'days').format("MM/DD");
    var newnode=document.getElementById("calendar_display");
    let className = '';

    for(i = -2; i<36 ; ++i){
        dateConverted=new Date(moment().locale('en').add(i, 'days').format('MM/DD'));
        let todayDateTwo = moment(todayDate).add(2,'days');
        let weekdayName = moment(todayDateTwo).format('dddd');
        //console.log(weekdayName);
        if(i<0){
            className = 'pastDays'
        }
        if(dateConverted.getDay() == 5 || dateConverted.getDay() ==6){
            className = 'weekend'
        } else if (i<= 0){
            className = 'pastDays'

        }else{
            className = 'calendarDate'
        }
        if(i==-2){
            weekdayName = moment(todayDateTwo-1).format('dddd');
        }
        $('#opsCalendarspinners').append('<input id="spinner'+i+'" name="opsAc'+i+'">');
        $('#spinner'+i).spinner();
        //$('#opsCalendarspinners').append('<div id="opsDate'+i+'" class='+ className
          //  + ' ondblclick ="dateDblClick()" onclick= "getid()" oncontextmenu = "testFunction(); return false;">'
            //+weekdayName+'<br>'+ todayDate +'</div>');
        newnode.insertAdjacentHTML("beforeend", '<div id="date'+i+'" class='+ className
            + ' ondblclick ="dateDblClick()" onclick= "getid()" oncontextmenu = "dateContextMenu(); return false;">'
            +weekdayName+'<br>'+ todayDate +'</div>');
        if(i==-2){
            //todayDate = moment().add(1, 'days').format('MM/DD');
        }
        todayDate = moment().add(i, 'days').format('MM/DD');

    }
}
function switchsquadron(){
    $('#mxDisplay').html('');
    $('#calendar_display').html('');
    $('#buno_display').html('');
    $('#bunoDraggables').html('');
    switchsquadronData();
    createCalendar();
}
function createCalendar() {
    populatecalendar();
    addDates();
}
function dateDblClick(){



    confirm()
}
function showBottomModal() {
    //var bottomModal = document.getElementById("bottomModal");
    var modal= document.getElementById("settingsModal");
    modal.style.display = "grid";

}
function closeModal(){
    var modal = document.getElementById('settingsModal');
    modal.style.display = "none";
}
function instantiateBunoDroppable() {

$("#bunoDroppable").droppable({
    drop: function(event, ui){
        $(this).addClass('bunoDroppableHighlight');
        let draggableId = ui.draggable.attr('id');
        let BUNO = ui.draggable.attr('data-value');
        $('#loadDetButton').data(draggableId,BUNO);
        //let numBunos = $('#date1').data('assignedAcft')
        //let bunoToEnter = 0
        //console.log(numBunos);
        /*for(j = 0; j<numBunos; ++j) {
            let bunoTest = $('#loadDetButton').data('BUNO'+j)
            //let j=2;
            if(bunoTest !== undefined){
                alert(bunoTest)
                bunoToEnter=parseInt($('#loadDetButton').data('BUNO'+j));
                //console.log(typeof parseInt($('#loadDetButton').data('BUNO'+j)));
            }
            if(bunoToEnter!==0){
                console.log(bunoToEnter);
            }
        }*/
        //console.log(ui.draggable.attr('data-value'));
        //let i=2
        //console.log($('#loadDetButton').data('BUNO'+i))
        //console.log(typeof $('#loadDetButton').data('DET2132456'));
        //droppedBunos();
    }
});
$("#detStartDatePicker").datepicker();
$("#detEndDatePicker").datepicker();


}
function droppedBunos(){
}
function loadDet(){
let numBunos = $('#date1').data('assignedAcft');
let bunoToEnter = 0
    for(j = 0; j<numBunos; ++j) {
        bunoToEnter=parseInt($('#loadDetButton').data('BUNO'+j));
        let loadDetArray = new Array;
        loadDetArray[0] = bunoToEnter;
        loadDetArray[1] = squadron_select.value;
        loadDetArray[2] = $('#detStartDatePicker').val();
        loadDetArray[3] = $('#detEndDatePicker').val();
        loadDetArray[4] = $('#detachmentLocationInput').val();
        loadDetArray[5] = $('#detachmentNameInput').val();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log('OUT IT WENT HOPEFULLY');
                let response = JSON.parse(xhttp.responseText);
                console.log(response)
            }
        };
        xhttp.open("POST", "detLoad.php", true);
        xhttp.send(JSON.stringify(loadDetArray));
    }




}

function showOpsCalendar(){
    //$('#opsCalendarLabel').show();
    $('#opsCalendarLabel').css('display', 'flex');
    $('#opsCalendarspinners').css('display', 'flex');
    hideMenu();
    //$('#opsCalendarspinners').show();
}
function hideOpsCalendar(){
    $('#opsCalendarLabel').hide();
    $('#opsCalendarspinners').hide();
    saveOpsDetails()
}

function dateContextMenu(){
var e = window.event;
var posX = e.clientX;
var posY = e.clientY;


$('#contextMenu').css({
        top: posY + "px",
        left: posX +'px'
    });

$('#contextMenu').show();
setTimeout(hideMenu, 2000);
//$('#contextMenu').delay(300).hide();
return false;

}
function hideMenu(){
    $('#contextMenu').hide();
}
function testFunction(){
    //var spinner = $('#spinner1').spinner();
    //alert(spinner.val());//spinner().spinner('opsAc-2'));
    //saveOpsDetails()
    loadOpsDetails()
    //$('#spinner1').spinner().val(5);
}
function loadOpsDetails(){
    let squadronName = squadron_select.value;
    var xhttp = new XMLHttpRequest();
    let outputArray = new Array;

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let outputArray = JSON.parse(xhttp.responseText);
            for(i = 0; i<35; ++i){
                var spinner = $('#spinner'+i).spinner().val(outputArray[i][2]);

            }
        }

    };

    xhttp.open("POST", "opsRetrieveDetails.php", true);
    xhttp.send(JSON.stringify(squadronName));

}
function saveOpsDetails(){
    let opsNeedArray = new Array();
    let todayDate = moment().format('YYYY-MM-DD');
    let squadronName = squadron_select.value;
    //todayDate = moment()
    opsNeedArray[0]= squadronName;
    let j =1;
    for( i = 1; i<35; ++i){
        var spinner = $('#spinner'+i).spinner();
        opsNeedArray[i]= spinner.val();
        opsNeedArray[i+34] = todayDate;
        //opsNeedArray[36]=12;//todayDate;
        todayDate = moment().add(j, 'days').format('YYYY-MM-DD');
        ++j;
        //console.log(opsNeedArray[i]);
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log('OUT IT WENT HOPEFULLY');
            let response = JSON.parse(xhttp.responseText);
            console.log(response)
        }
    };
    //console.log(JSON.stringify(opsNeedArray));
    xhttp.open("POST", "opsLoadData.php", true);
    xhttp.send(JSON.stringify(opsNeedArray));

}
