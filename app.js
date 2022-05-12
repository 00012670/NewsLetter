const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");


const app = express();

//Using body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

//The public folder which holds the CSS and images
app.use(express.static("public"))

//Sending the signup.html file to the browser
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

//Setting up mailchimp
mailchimp.setConfig({
  apiKey: "9ac0815cbeca09033b96f4571ad9ccaa-us10",
  server: "us10"
})

app.post("/", function(req, res) {

  const firstName = req.body.firstName;
  const secondName = req.body.secondName;
  const email = req.body.email;

  const listId = "e25b85c138";

  //Creating an object with the users jsonData
  const subscribingUser = {
    firstName: firstName,
    lastName: secondName,
    email: email
  };

  //Uploading the data to the Server
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
    //If all goes well logging the contact's id
    res.sendFile(__dirname + "/success.html")
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${
         response.id
         }.`
    );
  }
  run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.")
});



//API Key
// 9ac0815cbeca09033b96f4571ad9ccaa-us10

//List ID
// e25b85c138
