# finalswitch
FinalSwitch is javascript framework for event driven development.

1. include finalswitch.js

2. add switches
finalswitche.addSwitch('state1');
finalswitche.addSwitch('state2');

3. register machines(functions) to run by switches
finalswitch.registerMachine('showAlertWindow', function() {
    alert('fired state 1, 2');
});

4. connect switches and machine
finalswitch.connectSwitch(showAlertWindow, ['state1', 'state2']);

5. chage state of switch to 'on' by asynchorous event
$.ajax({
    url: 'http://xxx',
    success: function() {
        finalsiwtch.switchOn('state1');
    }
});
$.ajax({
    url: 'http://yyy',
    success: function() {
        finalsiwtch.switchOn('state2');
    }
});

or

$('#e1').click(fucntion() {
    finalswitch.switchOn('state1');
}
$('#e2').click(fucntion() {
    finalswitch.switchOn('state2');
}

now, 'showAlertWindow' is running, then you can show alert window
