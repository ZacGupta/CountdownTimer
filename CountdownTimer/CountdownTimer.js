﻿//Global Variables
var myTimer;

var globalSeconds = 0;
var globalSecondsCompleted = 0;
var globalSecondsRemaining = 0;

var taskSeconds = 0;
var taskSecondsCompleted = 0;
var taskSecondsRemaining = 0;

var taskTracker = 0;

var exportInfo = [];

var paused = false;
var started = false;
var allTasksCompleted = false;

const circumference = 2 * Math.PI * document.getElementById("circle").getAttribute('r');
const taskCompletionAudio = new Audio("/Sounds/taskComplete.wav");

//EVENT HANDLERS
//Task
$("#task").on('click', function () { addTask($("#addTask").val(), $("#addTaskDuration").val()); });
//Timer
$("#start").on('click', start);
$("#pause").on('click', pause);
$("#stop").on('click', stop);
$("#clear").on('click', clear);

//CSV
var input = document.querySelector('input[type="file"]');
input.addEventListener('change', importCSV);
$("#exportToCSV").on('click', exportCSV);

//TIMER FUNCTIONS
/* Animates the SVG circle based on the task time. */

function animate() {
    $('.circle-animation').css('stroke-dashoffset', circumference - ((taskSecondsCompleted) * (circumference / taskSeconds)));
}

/* Stops the animation and resets it to the default position. */

function stopAnimation() {
    $('.circle-animation').css('stroke-dashoffset', circumference);
}

/* Starts the clock, or resumes if it was paused. */

function start() {
    //Prevent start from being executed if there are no tasks or all tasks are already complete.
    if (globalSecondsRemaining === 0)
        return;

    if (paused) {
        const currentTask = document.getElementsByTagName('li')[taskTracker];
        const icon = currentTask.querySelector('div').querySelector('.icon').querySelector('.fas');

        $(icon).removeClass();
        $(icon).addClass('fas fa-play').css('color', 'violet');

        document.getElementById("pause").classList.remove('pressed');
    }

    this.disabled = true;
    document.getElementById("start").classList.add('pressed');
    started = true;
    paused = false;
    myTimer = setInterval(timer, 1000);
}

/* Contains the core logic for the timer, and tracks the status of sub-tasks. */

function timer() {
    const currentTask = document.getElementsByTagName('li')[taskTracker];
    const nextTask = document.getElementsByTagName('li')[taskTracker + 1];

    if (typeof (currentTask) != "undefined") {
        currentTask.setAttribute('active', 'true');
    }

    //First Task
    if (globalSeconds === globalSecondsRemaining && typeof (currentTask) != "undefined" || allTasksCompleted) {
        allTasksCompleted = false;
        const icon = currentTask.querySelector('div').querySelector('.icon').querySelector('.fas');
        currentTask.setAttribute('style', 'background-color:#404040 !important');
        $(icon).removeClass();
        $(icon).addClass('fas fa-play').css('color', 'violet');

    }
    globalSecondsCompleted++;
    globalSecondsRemaining--;
    taskSecondsCompleted++;
    taskSecondsRemaining--;

    animate();

    //Completed task
    if (currentTask.getAttribute('minutes') * 60 === taskSecondsCompleted) {
        currentTask.setAttribute('complete', 'true');
        currentTask.setAttribute('active', 'false');
        currentTask.setAttribute('style', 'background-color: #1a1a1a !important; color: #a6a6a6 !important');

        //Update task status icon.
        const icon = currentTask.querySelector('div').querySelector('.icon').querySelector('.fas');
        $(icon).removeClass();
        $(icon).addClass('fas fa-check').css('color', 'cyan');
        taskCompletionAudio.currentTime = 0;
        taskCompletionAudio.play();

        taskSecondsCompleted = 0;
        taskTracker++;

        //Sets the task timer to the next task (if there is one)
        if (typeof (nextTask) != "undefined") {
            //Update task status icon and background colour.
            const nextIcon = nextTask.querySelector('div').querySelector('.icon').querySelector('.fas');
            $(nextIcon).removeClass();
            $(nextIcon).addClass('fas fa-play').css('color', 'violet');
            nextTask.setAttribute('style', 'background-color:#404040 !important');

            taskSeconds = nextTask.getAttribute('minutes') * 60;
            taskSecondsRemaining = taskSeconds;
        }
    }
    setTimerText("#totalCountdown", globalSecondsRemaining);
    setTimerText("#taskCountdown", taskSecondsRemaining);

    //All tasks completed
    if (globalSecondsRemaining <= 0) {
        clearInterval(myTimer);
        document.getElementById("start").disabled = false;
        started = false;
        allTasksCompleted = true;
        taskSeconds = 0;
        taskSecondsRemaining = 0;
        document.getElementById("start").classList.remove('pressed');
    }
}

/* Pauses the timer */

function pause() {
    if (paused || !started)
        return;

    clearInterval(myTimer);
    paused = true;
    document.getElementById("start").disabled = false;
    document.getElementById("start").classList.remove('pressed');
    document.getElementById("pause").classList.add('pressed');

    //Update task status icon.
    const currentTask = document.getElementsByTagName('li')[taskTracker];
    const icon = currentTask.children[0].querySelector('.icon').querySelector('.fas');
    $(icon).removeClass();
    $(icon).addClass('fas fa-pause').css('color', 'violet');
}

/* Resets the timer to default values without deleting any tasks */

function stop() {

    clearInterval(myTimer);
    stopAnimation();

    paused = false;
    started = false;
    globalSecondsCompleted = 0;
    globalSecondsRemaining = globalSeconds;
    taskSeconds = 0;
    taskSecondsCompleted = 0;
    taskSecondsRemaining = 0;
    taskTracker = 0;

    document.getElementById("start").classList.remove('pressed');
    document.getElementById("pause").classList.remove('pressed');

    //This block of code doesn't execute when this method is called inside clear().
    //Resets all tasks to display as incomplete and resets the task timer.
    if (this === document.getElementById("stop")) {
        const taskList = document.getElementsByTagName('li');
        $.each(taskList, function (i) {

            if (i === 0 && typeof (taskList[0]) != "undefined") {
                taskSeconds = taskList[0].getAttribute('minutes') * 60;
                taskSecondsRemaining = taskSeconds;
            }
            if (taskList[i].getAttribute('complete') === 'true') {
                taskList[i].setAttribute('complete', 'false');
            }
            if (taskList[i].getAttribute('active') === 'true') {
                taskList[i].setAttribute('active', 'false');
            }
            //Update task status icons and background colour.
            const icon = taskList[i].querySelector('div').querySelector('.icon').querySelector('.fas');
            $(icon).removeClass();
            $(icon).addClass('fas fa-stop').css('color', 'orangered');
            taskList[i].setAttribute('style', 'background-color: #262626 !important; color: #d9d9d9 !important');
        });
        setTimerText("#totalCountdown", globalSecondsRemaining);
        setTimerText("#taskCountdown", taskSecondsRemaining);
    }
    document.getElementById("start").disabled = false;
}

/* Hard reset for the entire app (timer and all tasks) */

function clear() {
    stop();

    globalSeconds = 0;
    globalSecondsRemaining = 0;
    exportInfo = [];

    $('#timerTaskList').empty();
    $('#taskListHeading').empty().css('display', 'none');

    resetTimerText("#totalTime");
    resetTimerText("#totalCountdown");
    resetTimerText("#taskCountdown");

    if (document.querySelector('input[type="file"]') != null) {
        document.getElementById("importCSV").value = "";
    }
}

//TASK FUNCTIONS
/* Validates user input for task name and duration, and displays the relevant error message if necessary. */

function isValidInput(task, minutes) {
    //Input Validation with error notifications.
    if (IsNullOrWhiteSpace(task)) {
        document.getElementById('alertText').textContent = "Task name cannot be empty.";
        $("#alert").addClass('show').css('color', 'orangered').fadeTo(2000, 500).slideUp(500);
        return false;
    }
    if (task.length > 25) {
        document.getElementById('alertText').textContent = "Task name must not exceed 25 characters.";
        $("#alert").addClass('show').css('color', 'orangered').fadeTo(2000, 500).slideUp(500);
        return false;
    }
    if (minutes < 0 || IsNullOrWhiteSpace(minutes) || !Number.isInteger((minutes * 60))) {
        document.getElementById('alertText').textContent = "Duration must be a valid number greater than 0.";
        $("#alert").addClass('show').css('color', 'orangered').fadeTo(2000, 500).slideUp(500);
        return false;
    }
    if (minutes > 5999) {
        document.getElementById('alertText').textContent = "Duration must be less than 6000 minutes.";
        $("#alert").addClass('show').css('color', 'orangered').fadeTo(2000, 500).slideUp(500);
        return false;
    }
    return true;
}

/* Accepts task input from text/number forms and CSV Files, then adds <li> elements accordingly.
 Increments the global time variables every time a new task is added,
 and calls setTimerText() to increment the timer on the UI.
 This function should only be called inside the onclick function for
 the add task button and from within parseCSV() */

function addTask(task, minutes) {
    minutes = removeLeadingZeros(minutes);

    if (isValidInput(task, minutes)) {
        // Add Task List title if one doesn't already exist.
        if (!document.getElementById("currentTasks")) {
            //Set the height of the taskList based on the window size, this allows a scroll bar to appear automatically if the list overflows.
            $('#timerTaskList').height($(window).height() * 0.66);

            const container = $('#taskListHeading');

            $('<strong>').attr('id', 'currentTasks')
                .css('font-size', '1.25rem').text("Task List").appendTo(container);

            container.css('background-color', '#333333').css('margin-bottom', '10px')
                .css('padding-bottom', '2%').css('padding-top', '2%')
                .css('border', '2px solid #1a1a1a').css('display', 'block');
        }
        globalSeconds += minutes * 60;
        globalSecondsRemaining += minutes * 60;

        //Update task time-tracking variables if this is the first task to be entered.
        if (document.getElementsByTagName('li').length === 0) {
            taskSeconds = minutes * 60;
            taskSecondsRemaining = taskSeconds;
        }

        //Add to ExportCSV array
        exportInfo.push([task, minutes]);

        //Append to '#timerTaskList'.
        const listItem = $('<li>');
        const div = $('<div>');
        const icon = $('<p>');

        listItem.addClass('list-group-item').attr('id', 'listItem')
            .attr('complete', 'false').attr('active', 'false')
            .attr('minutes', minutes).attr('draggable', 'true');
        div.appendTo(listItem);

        $('<p>').addClass('list-text').css('font-size', 20).css('float', 'left').text(task).appendTo(div);
        $('<i>').addClass("fas fa-stop").appendTo(icon);
        icon.addClass('icon').css('color', 'orangered').css('float', 'right').css('margin-left', '20px').appendTo(div);
        $('<p>').addClass('list-text duration').css('color', '#bfbfbf').css('float', 'right').appendTo(div);
        listItem.appendTo("#timerTaskList");

        //Add time in HMS format to the task list.
        const currentTask = document.getElementsByTagName('li')[document.getElementsByTagName('li').length - 1];
        const id = currentTask.querySelector('div').querySelector('.duration');
        setTimerText(id, minutes * 60);

        //Reset input textboxes.
        $("#addTask").val("");
        $("#addTaskDuration").val(0);

        //Fixes a bug that occurs in the task timer when all tasks are finished, then new one(s) added, and start is pressed.
        if (taskSeconds === 0 && globalSecondsRemaining != 0) {

            const taskList = document.getElementsByTagName('li');
            let i = 0;

            while (true) {
                //If the loop has gone beyond all tasks.
                if (typeof (taskList[i]) === "undefined") {
                    break;
                }
                //If this is the new task, or first task in the new set of tasks after all tasks have been completed.
                if (taskList[i].getAttribute('complete') === 'false') {
                    taskSeconds = taskList[i].getAttribute('minutes') * 60;
                    taskSecondsRemaining = taskSeconds;
                    //Fixes a visual bug that occurs in the same context, and prevents the timer from displaying this task.
                    setTimerText("#taskCountdown", taskSecondsRemaining);
                    break;
                }
                i++;
            }
        }
        setTimerText("#totalTime", globalSeconds);
        setTimerText("#totalCountdown", globalSecondsRemaining);

        //Instantiate the task countdown timer if this is the first task.
        if (document.getElementsByTagName('li').length === 1) {
            setTimerText("#taskCountdown", taskSecondsRemaining);
        }
        return true;
    } else {
        return false;
    }
}

//CSV FUNCTIONS
/* Imports the CSV file provided by the user, which is then passed onto parseCSV() */

function importCSV() {
    let successful = false;
    const reader = new FileReader();
    const input = document.querySelector('input[type="file"]');
    reader.readAsText(input.files[0]);
    reader.onload = function () {
        successful = parseCSV(reader.result);
    }
    document.getElementById("importCSV").value = "";

    // Show importCSV success notification
    if (successful) {
        document.getElementById('alertText').textContent = "Imported CSV file.";
        $("#alert").addClass('show').css('color', '#d9d9d9').fadeTo(2000, 500).slideUp(500);
    }
}

/* Parses the imported CSV file passed on by importCSV(), calls addTask(task, minutes) for each task
 specified in the CSV file */

function parseCSV(data) {
    //Split the string, store in array, pop the last element (empty string), and splice the first two elements (headers).
    let successful = false;
    const dataArray = data.replace(/\n/g, ",").split(",");
    let lastIndex = dataArray.length - 1;

    //Remove trailing white space.
    while (IsNullOrWhiteSpace(dataArray[lastIndex])) {
        dataArray.pop();
        lastIndex--;
    }

    //Remove column headers.
    dataArray.splice(0, 2);

    //Store the data in arrays and add to task list.
    $.each(dataArray,
        function (i) {
            if (i % 2 === 0) {
                successful = addTask(dataArray[i], dataArray[i + 1]);
                if (!successful) {
                    clear();
                    // Show invalid CSV error messsage
                    document.getElementById('alertText').textContent = "Invalid CSV File!";
                    $("#alert").addClass('show').css('color', 'orangered').fadeTo(2000, 500).slideUp(500);
                    return false;
                }
            }
        });
    return true;
}

/* exportCSV() gathers the current CSV cache and downloads a CSV file with the appropriate data. */

function exportCSV() {
    // if csv info is empty, dont download
    if (exportInfo.length === 0) {
        //show empty CSV cache error.
        document.getElementById('alertText').textContent = "Nothing to export!";
        $("#alert").addClass('show').css('color', 'orangered').fadeTo(2000, 500).slideUp(500);
    } else {
        // csv string to build upon, starts with title
        let csv = "placeholder,taskName,minutes\n";
        // for each, join each arr row with a comma and end with a new line
        exportInfo.forEach(function (row) {
            csv += row.join(',');
            csv += "\n";
        });

        // create download link for csv file
        const hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8' + encodeURI(csv);
        hiddenElement.target = "_blank";
        hiddenElement.download = 'timeConfiguration.csv';
        hiddenElement.click();

        //Show exportCSV success notification.
        document.getElementById('alertText').textContent = "Exported CSV file.";
        $("#alert").addClass('show').css('color', '#d9d9d9').fadeTo(2000, 500).slideUp(500);
    }
}

//UTILITY FUNCTIONS
/* Accepts hours, minutes and seconds as an input , returns the time value in seconds) */
function toSeconds(hours, minutes, seconds) {
    return (hours * 3600) + (minutes * 60) + seconds;
}

/* Accepts seconds as input and returns hours, minutes and seconds as an array where
 [0] is hours, [1] is minutes, and [2] is seconds. */
function toHMS(totalSeconds) {
    const hours = Math.floor((totalSeconds / 3600));
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const seconds = Math.floor(totalSeconds % 60);
    return [hours, minutes, seconds];
}

/* Takes the id of the timer as an input, as well as the number of seconds to be converted into HMS format for a particular timer
 and sets the text for that element in HMS format.
 The id parameter will accept any identifier to a unique, jQuery selectable object (must not be a collection of objects).*/

function setTimerText(id, secs) {

    const hms = toHMS(secs);
    let [hours, minutes, seconds] = hms;

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    $(id).text(hours + ":" + minutes + ":" + seconds);
}

/* Takes the id of the timer as an input and resets the element's text to default values.
 The id parameter will accept any identifier to a unique, jQuery selectable object (must not be a collection of objects).*/

function resetTimerText(id) {
    $(id).text("00:00:00");
}

/* Returns true if the string is null or white space*/

function IsNullOrWhiteSpace(value) {
    if (value == null)
        return true;
    return value.replace(/\s/g, '').length === 0;
}

/* Trims a string and removes any leading zeros.*/

function removeLeadingZeros(value) {
    value = value.trim();
    return value.replace(/^0+/, '');
}