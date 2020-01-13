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
    loadOpsDetails();
    $('#opsCalendarspinners').html('');

}
//Need to be able to dynamically populate the SQD select to allow for other TMS
function populateSqdDropdown(){
    var xhttp = new XMLHttpRequest();
    $('#sqd_image').data('lastBUNOSelected','ss');
    instantiateBunoDroppable();
    hideOpsCalendar();
    /*$('.calendarSortable').sortable({
        axis: 'x'
    });*/
    $('#accordion').accordion();
    $('#accordion').accordion("option", "autoHeight", false);
    instantiateBUNOMXDatePickers();
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
            var newnode = document.getElementById("buno_display");
            let detachmentNodeBunos = $('#bunoDraggables');
            var loop_counter = output_array.length;
            var mxEventsDueArray = new Array;
            var assignedACnode = document.getElementById('assigned_aircraft_output');
            assignedACnode.innerHTML = loop_counter;
            for (i = 0; i < loop_counter; ++i) {
                newnode = document.getElementById("buno_display");
                newnode.insertAdjacentHTML("beforeend", '<div class="bunodiv" data-value ='
                    + output_array[i][0] + ' id = ' + output_array[i][0] + ' onclick= "populateAccordion()" > <br>'
                    + output_array[i][0] + '</div>');
                detachmentNodeBunos.append('<div class="bunodivDraggable" data-value ='
                    + output_array[i][0] + ' id =BUNO'+i + /*output_array[i][0] +*/ ' onclick= "" ><br>'
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
                    if(j==-2) {
                        $('#mxDisplay').append("<div class='overallSortable' id =MXInfo" + buno + " ></div>");

                    }

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
                    newnode = document.getElementById("MXInfo"+buno);

                    newnode.insertAdjacentHTML("beforeend", '<div id ='+buno+j+' class =' + className + ' ><br>'
                        + output_string + '</div>');
                    todayDate = moment().add(j, 'days').format('YYYY-MM-DD');
                    console.log(dayCounter);
                     if(className == 'longMxCalendarElement' && dayCounter == 0){
                        v = j;
                        k = j-1;
                        l = j-2;
                        m = j-3;
                        n = j-4;
                        o= j-5;
                        p= j-6;
                        $("#"+buno+k+",#"+buno+v+',#'+buno+l).wrapAll("<span id =MXItem"+buno+j+" class='emptySpanMX'/>");
                        //$("#"+buno+k+",#"+buno+v+',#'+buno+l+",#"+buno+m).wrapAll("<span id =MXItem"+buno+j+j+" class='emptySpan'/>");
                        $("#MXItem"+buno+j+",#"+buno+m+",#"+buno+n+",#"+buno+o+",#"+buno+p).wrapAll("<span id =MXItem"+buno+j+j+" class='emptySpan'/>");
                        //$('.emptySpan').children().html('MW')
                        /*for(z==6;z>=0; --z){

                        }*/

                        //$("#"+buno+j).after("</span>");
                    }


                    //$("#"+buno+j).addClass('sortableMXEvent')
                    //$(".sortableMXEvent").sortable();
                    //$(".longMxCalenderElement").addClass('sortableMXEvent')


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

        /*$(".emptySpanMX").draggable({
            axis:'x',
            containment: 'parent',
            connectToSortable: '.emptySpan'
        });*/
        $(".emptySpan").sortable({
            helper: 'clone',
            forceHelperSize: true,
            axis: 'x',
            placeholder: 'sortable-placeholder',
            revert: true

        });
        $("#mxDisplay").sortable({
            helper: 'clone',
            forceHelperSize: true,
            axis: 'y',
            placeholder: 'sortable-placeholder',
            revert: true

        });
        $(".emptySpan").children().css("background-color","#303030")
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
    let lastId = $('#sqd_image').data('lastClickedId');
    $('#date'+idnumber2).css('color', 'Yellow');
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
                $("#MIL"+buno).append('<div>&emsp;'+mxname+'</div>');
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
        if(dateConverted.getDay() == 5 && i>0 || dateConverted.getDay() ==6 && i>0){
            className = 'weekend'
        } else if (i<= 0){
            className = 'pastDays'

        }else if (i==1){
            className = 'todayDate'
        }
        else{
            className = 'calendarDate'
        }
        if(i==-2){
            weekdayName = moment(todayDateTwo).format('dddd');
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
    $('#opsCalendarLabel').css('display', 'flex');
    $('#opsCalendarspinners').css('display', 'flex');
    hideMenu();

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

return false;

}
function hideMenu(){
    $('#contextMenu').hide();
}
function testFunction(){

  function Person(name){
      this.name = name;
    }
let john = new Person('John')
    alert(john.name)



}
function loadOpsDetails(){
    let squadronName = squadron_select.value;
    var xhttp = new XMLHttpRequest();
    let outputArray = new Array;

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let outputArray = JSON.parse(xhttp.responseText);
            for(i = 1; i<38; ++i){
                var spinner = $('#spinner'+i).spinner().val(outputArray[i-1][2]);
                if(i==1){
                    var spinner = $('#spinner1').spinner().val(outputArray[0][2]);
                    console.log('got here')
                }
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
    for( i = 1; i<38; ++i){
        var spinner = $('#spinner'+i).spinner();
        opsNeedArray[i]= spinner.val();
        opsNeedArray[i+37] = todayDate;
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
function instantiateBUNOMXDatePickers(){
    for(x=2; x<11; ++x){
        $('#datePicker'+x).datepicker();
        /*
        $('#twentyEightDayPicker').datepicker();
        $('#eightyFourDayPicker').datepicker();
        $('#oneTwelveDayPicker').datepicker();
        $('#oneSixEightDayPicker').datepicker();
        $('#threeThreeSixDayPicker').datepicker();
        $('#threeSixFiveDayPicker').datepicker();
        $('#sevenTwentyEightDayPicker').datepicker();
         */
    }
}
function populateAccordion(){
    populateBUNOModInfo();
    populateBUNOMXInfo();
    highlightSelectedBUNO();
}

function highlightSelectedBUNO(){
    let bunoSelected= event.target.id;
    $('#'+bunoSelected).css('background-color', 'tan');
    $('#'+bunoSelected).css('color', 'black');
    let lastBUNOSelected=$('#sqd_image').data('lastBUNOSelected');
    $('#sqd_image').data('lastBUNOSelected', bunoSelected);
    $('#'+lastBUNOSelected).css('background-color', '#404040');
    $('#'+lastBUNOSelected).css('color', 'white');


}
function populateBUNOModInfo(){

}
function populateBUNOMXInfo(){
    let bunoSelected = event.target.id;
    $('#selectedBunoMXDisplay').html('Displaying MX Data for BUNO:'+bunoSelected);
    let stringToSend = JSON.stringify(bunoSelected);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhttp.responseText);
            for( x = 2; x<10; ++x) {
                let dateToBeConverted = response[0][x];
                //console.log(fourteenDay);
                //let dateConverted = fourteenDay.replace(/-/g,'/');
                let newYear = dateToBeConverted.slice(0, 4);
                let newMonth = dateToBeConverted.slice(5, 7);
                let newDay = dateToBeConverted.slice(8, 10);
                let newDate = newMonth + '/' + newDay + '/' + newYear;
                //console.log(newDate);
                //console.log(fourteenDay);
                $('#datePicker'+x).datepicker('setDate', newDate)
            }
        }
    }
    xhttp.open("POST", "mxDataRetrieve.php", true);
    xhttp.send(JSON.stringify(bunoSelected));
    //xhttp.setRequestHeader("Content-type", "application/json");
}
function saveNewMXDates() {
    let bunoSelected = $('#sqd_image').data('lastBUNOSelected');
    let xhttp = new XMLHttpRequest();
    let arrayToSend = new Array();
    arrayToSend[0] = bunoSelected;
    arrayToSend[1] = squadron_select.value;
    for(x = 2; x<10; ++x) {
        let dateToBeConverted= $('#datePicker'+x).val();
        let newYear = dateToBeConverted.slice(6, 10);
        let newMonth = dateToBeConverted.slice(0,2 );
        let newDay = dateToBeConverted.slice(3, 5);
        let newDate = newYear + '-' + newMonth + '-' + newDay;
        arrayToSend[x] = newDate;//$('#datePicker'+x).val();
        //console.log(arrayToSend)
    }
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhttp.responseText);
            console.log(response);
        }
    }
    xhttp.open("POST", "saveNewMXDates.php", true);
    xhttp.send(JSON.stringify(arrayToSend));
    switchsquadron();
}

