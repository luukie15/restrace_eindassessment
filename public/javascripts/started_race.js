var socket;
$(document).ready(function () {
    doGetWaypointsForStartedRace();
    socket = io.connect('localhost:3000');
});

function doGetWaypointsForStartedRace() {
    $(".data_result").html('');
    var raceId = $("#raceid").val();
    var userId = $("#userid").val();
    $.getJSON('/api/races/' + raceId + '/waypoints', function (data) {
        $.each(data.array, function () {
            var buttonHtml = "";
            if(data.race.status == 'started'){
                buttonHtml = "<button class='btn btn-small btn-primary check_waypoint' id=" + this.id + ">CHECK JONGE</button>";
            }

            for (i = 0; i < data.race.results.length; i++) {
                if (data.race.results[i].user == userId && data.race.results[i].waypoint == this.id) {
                    buttonHtml = "";
                }
            }

            $(".data_result").append("<div class='row_waypoint'><div class='single_waypoint'>" + this.name + "</div>" + buttonHtml + "</div></br>");
        });
        addClickHandlerCheckWaypoint();
    });
}

function addClickHandlerCheckWaypoint() {
    $('.check_waypoint').unbind('click');
    $(".check_waypoint").each(function () {
        $(this).click(function () {
            var waypointId = $(this).attr('id');
            var raceId = $("#raceid").val();
            var button = $(this);
            var checkWaypoint = {
                'waypointId': waypointId
            };
            //socket.emit('message', 'ergens op geklikt');
            $.ajax({
                type: 'POST',
                data: checkWaypoint,
                url: '/api/races/' + raceId + '/checkrace',
                dataType: 'JSON'
            }).done(function (response) {
                button.parent().find('button').remove();
                socket.emit('checking', response.username + " checked checkpoint " + response.waypointname + " in race " + response.racename);
            });
        });
    });
}