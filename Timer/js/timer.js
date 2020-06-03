class Timer {
    constructor() {
        // time inputs
        this.hoursInput = null;
        this.minutesInput = null;
        this.secondsInput = null;

        // buttons
        this.confirmTimeButton = null;
        this.editTimeButton = null;
       
        this.runTimerButton = null;
        this.pauseTimerButton = null;
        this.rerunTimerButton = null;
        this.stopAlarmButton = null;

        //sound
        this.alarmSound = null;

        this.isTimeConfirmed = false;

        // initial time
        this.initialHours = 0;
        this.initialMinutes = 0;
        this.initialSeconds = 0;

        // current time
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;

        //holds 1000ms interval timer 
        this.timer = null;

        // ui selectors
        this.UiSelectors = {
            hoursInput: "hours",
            minutesInput: "minutes",
            secondsInput: "seconds",
            confirmTimeButton: "[data-confirm-button]",
            runTimerButton: "[data-run-button]",
            editTimeButton: '[data-edit-button]',
            rerunTimerButton: '[data-reset-button]',
            pauseTimerButton: '[data-stop-button]',
            stopAlarmButton: '[data-alarm-stop]',
            alarmSound: '[data-alarm-sound]'
        };
    }

    initializeTimer() {
        this.hoursInput = document.getElementById(this.UiSelectors.hoursInput);
        this.minutesInput = document.getElementById(this.UiSelectors.minutesInput);
        this.secondsInput = document.getElementById(this.UiSelectors.secondsInput);
        this.confirmTimeButton = document.querySelector(this.UiSelectors.confirmTimeButton);
        this.runTimerButton = document.querySelector(this.UiSelectors.runTimerButton);
        this.editTimeButton = document.querySelector(this.UiSelectors.editTimeButton);
        this.rerunTimerButton = document.querySelector(this.UiSelectors.rerunTimerButton);
        this.pauseTimerButton = document.querySelector(this.UiSelectors.pauseTimerButton);
        this.stopAlarmButton = document.querySelector(this.UiSelectors.stopAlarmButton);
        this.alarmSound = document.querySelector(this.UiSelectors.alarmSound);

        this.confirmTimeButton.addEventListener('click',  () => this.setupTimer());
        this.editTimeButton.addEventListener('click', () => this.setTimerToDefault());
        this.rerunTimerButton.addEventListener('click', () => this.rerunTimer());
        this.runTimerButton.addEventListener('click', () => this.runTimer());
        this.pauseTimerButton.addEventListener('click', () => this.pauseTimer());
        this.stopAlarmButton.addEventListener('click', () => this.stopAlarm());
    }

    setupTimer() {
        if(this.isTimeConfirmed === false) {
            // make inputs readonly
            this.toggleWritableInputs();

            // read initial time from inputs
            this.initialHours = Number(this.hoursInput.value);
            this.initialMinutes = Number(this.minutesInput.value);
            this.initialSeconds = Number(this.secondsInput.value);

            // setup current time
            this.hours = this.initialHours;
            this.minutes = this.initialMinutes;
            this.seconds = this.initialSeconds;

            // enable run button
            this.runTimerButton.removeAttribute('disabled');

            // toggle confirm button to edit button
            this.toggleEditTimeButtons()

            // set time confirmed flag
            this.isTimeConfirmed = true;
        }
    }

    setTimerToDefault() {
        // if timer is running
        if(this.timer != null) {
            // switch pause button to run button
            this.toggleRunTimerButtons();
            
            // stop countdown
            clearInterval(this.timer);
            this.timer = null;
        }

        // if time has been confirmed
        if(this.isTimeConfirmed === true) {
            // make time inputs writable
            this.toggleWritableInputs();

            // save new initial time
            this.initialHours = this.hours;
            this.initialMinutes = this.minutes;
            this.initialSeconds = this.seconds;

            // disable run button
            this.runTimerButton.setAttribute('disabled', 'true');

            // switch edit button to confirm button
            this.toggleEditTimeButtons();

            // time is not confirmed now
            this.isTimeConfirmed = false;
        }
    }

    rerunTimer() {
        // assign initial time to inputs
        this.hoursInput.value = this.initialHours < 10 ? '0'+ this.initialHours : this.initialHours;
        this.minutesInput.value = this.initialMinutes < 10 ? '0'+ this.initialMinutes : this.initialMinutes;
        this.secondsInput.value = this.initialSeconds < 10 ? '0'+ this.initialSeconds : this.initialSeconds;
        
        // assign new current time
        this.hours = this.initialHours;
        this.minutes = this.initialMinutes;
        this.seconds = this.initialSeconds;
    }

    runTimer() {
        // show pause button instead run button
        this.toggleRunTimerButtons();
        
        // disable run button
        this.runTimerButton.setAttribute('disabled', 'true');

        // start countdown
        this.timer = setInterval(() => {
        if(this.hours === 0 && this.minutes === 0 && this.seconds === 0) {
            this.stopTimer();
            return;
        }
        this.updateTime();
        this.refreshTimer();    
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
        this.runAlarm();
    }

    pauseTimer() {
        if(this.timer != null) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.toggleRunTimerButtons();
        this.runTimerButton.removeAttribute('disabled');
    }

    runAlarm() {
        this.stopAlarmButton.classList.remove('is-hidden');

        this.editTimeButton.setAttribute('disabled', true);
        this.pauseTimerButton.setAttribute('disabled', true);
        this.rerunTimerButton.setAttribute('disabled', true);

        this.alarmSound.play();
    }

    stopAlarm(){
        this.stopAlarmButton.classList.add('is-hidden');
        this.setTimerToDefault();
        this.editTimeButton.removeAttribute('disabled');
        this.pauseTimerButton.removeAttribute('disabled');
        this.rerunTimerButton.removeAttribute('disabled');
        this.alarmSound.pause();
    }

    toggleRunTimerButtons() {
        this.runTimerButton.classList.toggle('is-hidden');
        this.pauseTimerButton.classList.toggle('is-hidden');
    }

    toggleEditTimeButtons() {
        this.confirmTimeButton.classList.toggle('is-hidden');
        this.editTimeButton.classList.toggle('is-hidden');
    }

    toggleWritableInputs() {
        this.hoursInput.classList.toggle('confirmed');
        this.minutesInput.classList.toggle('confirmed');
        this.secondsInput.classList.toggle('confirmed');

        if(this.hoursInput.hasAttribute('readonly') &&
            this.minutesInput.hasAttribute('readonly') &&
            this.secondsInput.hasAttribute('readonly'))
            {
                this.hoursInput.removeAttribute('readonly') ;
                this.minutesInput.removeAttribute('readonly');
                this.secondsInput.removeAttribute('readonly');
            } else {
                this.hoursInput.setAttribute('readonly', 'readonly');
                this.minutesInput.setAttribute('readonly', 'readonly');
                this.secondsInput.setAttribute('readonly', 'readonly');
            }
    }

    updateTime() {
        if(this.minutes === 0 && this.seconds === 0 && this.hours > 0) {
            this.hours--;
            this.minutes = 60;
        }
        if(this.seconds === 0 && this.minutes > 0) {
            this.minutes--;
            this.seconds = 60;
        }
        this.seconds--;
    }

    refreshTimer() {
        if(this.hours < 10) {
            this.hoursInput.value = '0' + this.hours;
        } else {
            this.hoursInput.value = this.hours;
        }

        if(this.minutes < 10) {
            this.minutesInput.value = '0' + this.minutes;
        } else {
            this.minutesInput.value = this.minutes;
        }

        if(this.seconds < 10) {
            this.secondsInput.value = '0' + this.seconds;
        } else {
            this.secondsInput.value = this.seconds;
        }
    }
}
