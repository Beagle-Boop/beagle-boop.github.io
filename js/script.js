var DATAURL = "https://ex10-470.firebaseio.com/boards/";
var BOARDURL = "https://ex10-470.firebaseio.com/boards.json";
var boardData;
var currentBoard = "none";
var multiplayerBoard = "none"

var UPDATEURL_START = "https://ex10-470.firebaseio.com/boards/";

var UPDATEURL_LIVES = "lives";
var UPDATEURL_TIMETOANSWER = "timeToAnswer";

var UPDATE_URL_END = [
    UPDATEURL_LIVES,
    UPDATEURL_TIMETOANSWER
];

$(document).ready(function () {
    $("#multiNone").click(function () { selectMultiplayerBoard("none") });

    $.get({
        url: BOARDURL
    })
        .done(function (data) {
            boardData = data;

            for (board in boardData) {

                var item = $('#hiddenLink').clone();
                item.attr("id", "boardItem")
                item.attr("onclick", 'selectBoard("' + board + '")');
                item.text(capitalizeFirstLetter(board));
                $('#boardDropdown').append(item);

                var item2 = $('#hiddenLink').clone();
                item2.attr("id", "multiBoard" + board);
                item2.attr("onclick", 'selectMultiplayerBoard("' + board + '")');
                item2.text("VS: " + capitalizeFirstLetter(board));
                $('#multiplayerDropdown').append(item2);
            }

        })

    $('#updateButton').click(function () {
        putData(currentBoard);
        if (multiplayerBoard != "none") {
            putData(multiplayerBoard);
        }

    });

    function updateUI() {
        $.get({
            url: BOARDURL
        })
            .done(function (data) {
                boardData = data;

                if (currentBoard != "none") {
                    $("#currentTimeToAnswer").text(boardData[currentBoard].timeToAnswer);
                    $("#currentLives").text(boardData[currentBoard].lives);
                }
            })
    }
    timeInterval = setInterval(updateUI, 1000);

});

function putData(board) {
    for (i in UPDATE_URL_END) {
        $.ajax({
            method: "PUT",
            url: DATAURL + board + "/" + UPDATE_URL_END[i] + ".json",
            data: $("#" + UPDATE_URL_END[i]).val().toString()
        })
    }
}

function selectMultiplayerBoard(boardName) {
    if (boardName == "none") {
        multiplayerBoard = "none";
        $("#currentMultiplayerBoard").text("None");
    } else {
        multiplayerBoard = boardName;
        $("#currentMultiplayerBoard").text(boardData[boardName].ownerName);
    }
}

function selectBoard(boardName) {
    if (currentBoard != "none") {
        $("#multiBoard" + currentBoard).show();
    }
    if (boardName == multiplayerBoard) {
        selectMultiplayerBoard("none");
    }
    $("#multiBoard" + boardName).hide();

    currentBoard = boardName;

    $("#currentBoard").text(boardData[boardName].ownerName);
    $("#timeToAnswer").val(boardData[boardName].timeToAnswer);
    $("#lives").val(boardData[boardName].lives);
    $("#currentTimeToAnswer").text(boardData[boardName].timeToAnswer);
    $("#currentLives").text(boardData[boardName].lives);
    $("#multiplayer-btn").show();
    $("#boardForm").show();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}