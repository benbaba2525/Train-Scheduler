

//Web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDbJdGFcPMHVFrgo15w7USSFIj2b6KE2Mo",
    authDomain: "train-scheduler-a0a02.firebaseapp.com",
    databaseURL: "https://train-scheduler-a0a02.firebaseio.com",
    projectId: "train-scheduler-a0a02",
    storageBucket: "train-scheduler-a0a02.appspot.com",
    messagingSenderId: "661411682919",
    appId: "1:661411682919:web:d8067cb24fd30c4f4112c2",
    measurementId: "G-Z6XJ0FLSRT"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();


  // Show current time
  var datetime = null,
  date = null;

var update = function () {
  date = moment(new Date())
  datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
  datetime = $('#current-status')
  update();
  setInterval(update, 1000);
});



  // Submit button for adding train scheduler
  $("#submitInput").on("click", function(event){
      event.preventDefault();

 // Grabs user input
 var trainName = $("#trainName-input").val().trim();
 var trainDestination = $("#destination-input").val().trim();
 var trainTime = $("#trainTime-input").val().trim();
 var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train scheduler data
var newTrain = {
    name: trainName,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency
};

 // Uploads train scheduler data to the database
 database.ref().push(newTrain);

// Logs everything to console
console.log(newTrain.name);
console.log(newTrain.destination);
console.log(newTrain.time);
console.log(newTrain.frequency);
alert("Train schduler successfully added");

// Clears all of the text-boxes
$("#trainName-input").val("");
$("#destination-input").val("");
$("#trainTime-input").val("");
$("#frequency-input").val("");

});

//Create Firebase event for adding train scheduler to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot){
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().time;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Scheduler Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainTime);
  console.log(trainFrequency);



});