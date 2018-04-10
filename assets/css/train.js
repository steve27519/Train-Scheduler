$(document).ready(function () {
// Firebase info
  var config = {
    apiKey: "AIzaSyBPTF4TpemK6sJb3Gekp5WdwKO08c0-gnY",
    authDomain: "train-scheduler-7b34a.firebaseapp.com",
    databaseURL: "https://train-scheduler-7b34a.firebaseio.com",
    projectId: "train-scheduler-7b34a",
    storageBucket: "",
    messagingSenderId: "832337319421"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
 
// Capture Button Click
$("#addTrain").on("click", function (event) {
    event.preventDefault();

    // text boxes values
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var freq = $("#interval").val().trim();

    // Pushing
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: freq,
    });
  });


  // Firebase adding
  database.ref().on("child_added", function (childSnapshot) {

    var newTrain = childSnapshot.val().trainName;
    var newLocation = childSnapshot.val().destination;
    var newFirstTrain = childSnapshot.val().firstTrain;
    var newFreq = childSnapshot.val().frequency;

    // Time
    var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();
    console.log(currentTime);
    // Difference between the times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");
    console.log(diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % newFreq;
    console.log(tRemainder);
    // Minutes Until Train
    var tMinutesTillTrain = newFreq - tRemainder;
    console.log(tMinutesTillTrain)
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var catchTrain = moment(nextTrain).format("HH:mm");

    // Display On Page
    $("#all-display").append(
      ' <tr><td>' + newTrain +
      ' </td><td>' + newLocation +
      ' </td><td>' + newFreq +
      ' </td><td>' + catchTrain +
      ' </td><td>' + tMinutesTillTrain + ' </td></tr>');

    // Clear fields
    $("#trainName, #destination, #firstTrain, #interval").val("");
    return false;
  },
    //Handle the errors
    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

}); 
