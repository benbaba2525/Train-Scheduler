

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

  
  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      // List of OAuth providers supported.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
    // Other config options...
  });

  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '<>',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
      
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

// -----------------------------------
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
 var firstTime = $("#firstTrainTime-input").val().trim();
 var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train scheduler data
var newTrain = {
    name: trainName,
    destination: trainDestination,
    time: firstTime,
    frequency: trainFrequency,
   
};

 // Uploads train scheduler data to the database
 database.ref().push(newTrain);

// Logs everything to console
console.log(newTrain.name);
console.log(newTrain.destination);
console.log(newTrain.time);
console.log(newTrain.frequency);




// Clears all of the text-boxes
$("#trainName-input").val("");
$("#destination-input").val("");
$("#firstTrainTime-input").val("");
$("#frequency-input").val("");

});

//Create Firebase event for adding train scheduler to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot){
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var firstTime = childSnapshot.val().time;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Scheduler Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(firstTime);
  console.log(trainFrequency);

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

// Current Time
var currentTime = moment();
console.log("Current time " + moment().format('MMMM Do YYYY, h:mm:ss a'));

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % trainFrequency;
console.log(tRemainder);

// Minute Until Train
var minutesAway = trainFrequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + minutesAway);

// Next Train
var nextTrain = moment().add(minutesAway, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
// Arrival time
var nextArrival = moment(nextTrain).format("hh:mm a");


// Append the new row to the table
$("#trainTable > tbody").append(
  "<tr><td>"  + trainName + 
  "</td><td>" +trainDestination +
  "</td><td>" +trainFrequency +
  "</td><td>" + nextArrival +
  "</td><td>" + minutesAway +
  "</td><td>" + "<i class='fa fa-trash' aria-hidden='true'></i>" +
  "</td></tr>");

// If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

$("body").on("click", ".fa-trash", function() {
  $(this).parents("tr").remove(); 
  alert("Delete button clicked");
});

