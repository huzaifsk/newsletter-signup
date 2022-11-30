// import required packages
const express= require("express");
const https= require("https");
const bodyparser= require("body-parser");

const app= express();
app.use(express.static("public"));

app.use(bodyparser.urlencoded({extended:true}));

// On the home route, send signup html template
app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

// Manage post request on home route and
// Send data to the MailChimp account via API
app.post("/",function(req,res){
    const firstName=req.body.firstName;
    const email=req.body.emailAddress;
    const lastName=req.body.lastName;

    const data={
        members:[{
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

// Converting string data to JSON data
    const jsonData= JSON.stringify(data);
    const url="https://us8.api.mailchimp.com/3.0/lists/d10166e8db";
    const options={
        method:"POST",
        auth:"Authorization:ec42e5e31224db3c486396b5c918423f-us8"
    }

// On success send users to success, otherwise on failure template
    const request=https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

// Failure route
app.post("/failure",function (req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running on port 3000.");
})
//api key
// ec42e5e31224db3c486396b5c918423f-us8

//audience id
// d10166e8db
