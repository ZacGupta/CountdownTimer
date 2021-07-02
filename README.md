# TeamTime User Manual

## Running TeamTime

To run TeamTime, it is recommended that you open the project using Microsoft Visual Studio 2019 and run ‘countdownTimer.html’ 
using the latest version of your web browser via IIS Express.

## Interface Overview
![Overview of page](doc/images/overview.png)
 
The top left side of the interface highlighted in red is the main timer, the violet fill inside the circle reflects the amount of time completed for the current task. 
The large timer inside the circle represents the amount of time remaining for the current task. The small timer located the top of the circle represents the total amount
of time for all tasks. The small timer located at the bottom of the circle represents the amount of time remaining for all tasks.

The buttons highlighted in orange allow users to control the timer and can be used to play, pause, stop, and clear the timer.

The section highlighted in yellow allows users to enter a task name, along with the duration, and the ‘Add Task’ button can be used to add a task to the ‘Task List’.

The bottom left side of the interface highlighted in green allows users to import and export time configurations as CSV files.

On the right side of the interface is the task list, each added task can be found here. Each block in the list displays the name and duration of a task, as well as
its status, which can be either completed, active (running or paused) or incomplete. The task list will not be displayed until at least one task has been added.

## Adding Tasks
There are two ways to add tasks, via the ‘Add Task’ button and via  the ‘Import CSV’ button.

### Via Add Task Button
 
![Images](doc/images/addTask.png)

Simply a enter a task name that is at least 1 character in length and no longer than 25 characters in length. The duration for the task must be entered as minutes,
however valid decimal values are allowed (e.g. 0.5 minutes can be entered to represent 30 seconds). The duration value must be greater than 0 and less than 6000.

### Via Import CSV Button
 
![Import](doc/images/importCSV.png)

The import CSV button allows users to bypass the ‘Add Task’ button and import time configurations via a CSV file. Simply click on the button, and you will be
directed to upload a CSV file from your device. All tasks specified in the CSV file will then be simultaneously added to the task list.


## Importing CSV Files
Your CSV files MUST be formatted correctly, otherwise the application will reject all tasks inside the file.
### Using a Text Editor
![Csv Notepad](doc/images/csvFileNotepad.png)
  
Your CSV file MUST follow the exact format as demonstrated in the image above. 
* There MUST be exactly two columns, with headers.
* There MUST NOT be any blank lines between the header and tasks.
* There MUST NOT be any blank lines between tasks.
* Each task name and duration MUST be separated by a comma.
* Each task name and duration MUST be valid.

If your CSV file is invalid, the application will notify you.

### Using Microsoft Excel
![Csv in Excel](doc/images/csvFileExcel.png)

If you are encountering any issues, it may be useful to edit and save the CSV file using Microsoft Excel to reduce the probability of user errors.

If all else fails, please use the provided 'example.csv' file in the docs folder.

## Exporting CSV Files
 
![Exporting CSV](doc/images/exportCSV.png)

All tasks in the task list can be exported to a CSV file with a single click of the ‘Export CSV’ button. 
It may be automatically downloaded to your default directory or you may be asked to specify a path for the file, depending on your browser and settings.
The downloaded file will be named 'timeConfiguration.csv'
## Controlling the Timer
![Timer buttons](doc/images/timerButtons.png)

You can control the timer using the four buttons shown in the image above.

### Play
![Play button](doc/images/play.png)

The play button allows you to start/resume the timer. There must be at least one incomplete task in the task list for this button to function.

### Pause
![Pause button](doc/images/pause.png) 

The pause button allows you to pause the timer. The timer must be active for this button to function.

### Stop
![Stop button](doc/images/stop.png)

The stop buttons clears the timer and resets all tasks, marking them all as incomplete. 

### Clear
![Clear button](doc/images/clear.png) 

The clear button functions as a hard reset for the entire application, it will clear the timer, and remove all tasks from the task list.

## Task List
### Overview

![Export csv](doc/images/taskList.png)

The task list will display each added task sequentially. For each task, on the far left is the task name, and on the far right is the duration and status of the task.

### Task Status Icons

![Incomplete task](doc/images/incompleteTask.png)
The task is currently inactive and incomplete.

![Completed task](doc/images/completedTask.png)
The task has been completed.

![Running task](doc/images/runningTask.png)
The Task is currently active and running.

![Paused task](doc/images/pausedTask.png)
The Task is currently active but paused.

## FAQ

**Can I add tasks while the timer is still running?**

Yes you can!

**How can I enter seconds into the task duration?**

You can use decimal values to specify seconds, for example, you can enter 1.25 to set the timer to 00:01:15.

**Which file do I run in Visual Studio?**

You should run 'countdownTimer.html', DO NOT run 'countdownTimer.js'!
