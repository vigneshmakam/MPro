
// Toggle password
var togglePassword = document.getElementById("show_password");
if (togglePassword) {
togglePassword.addEventListener('click', function() {
var x = document.getElementById("password");
if (x.type === "password") {
x.type = "text";
} else {
x.type = "password";
}
});
}

var togglePassword = document.getElementById("conf_password");
if (togglePassword) {
togglePassword.addEventListener('click', function() {
var x = document.getElementById("newpassword");
if (x.type === "password") {
x.type = "text";
} else {
x.type = "password";
}
});
}


var togglePassword = document.getElementById("conf_password1");
if (togglePassword) {
togglePassword.addEventListener('click', function() {
var x = document.getElementById("confirmpassword");
if (x.type === "password") {
x.type = "text";
} else {
x.type = "password";
}
});
}






// Form validate

$.validator.addMethod("alphabetsnspace", function(value, element) {
return this.optional(element) || /^[a-zA-Z ]*$/.test(value);
});

$.validator.addMethod('mypassword', function(value, element) {
return this.optional(element) || (value.match(/[a-zA-Z]/) && value.match(/[0-9]/));
})


// registration page validate
$("#register_page").validate({

// submitHandler: function() {
// window.location.href = '/images/js/verify_email.html';
// },

rules: {

fullname:{
required: true,
alphabetsnspace: true
},


email : {
required: true,
email: true
},

password : {
required: true,
minlength: 8,
mypassword:true
},


mentorchk:{
required: true
},

agree :{
required: true,
}

},
messages : {

fullname: {
required: "please enter your full name",
alphabetsnspace: "Full name should contain only alphabets",
},


email: {
required: "please enter your email ID",
email: "Please enter a valid email ID"
},

password: {
required: "please enter your password",
minlength: "password should contain min 8 character",
mypassword: "password should contain atlease one number"
},

mentorchk:{
required: "please select mentor/mentee",
},

agree:{
required: "please check the privacy policy",
}




}
});
	


// login form
$("#login_page").validate({

submitHandler: function() {
var email=$('#email').val()
window.location.href = 'onboarding.html';
localStorage.setItem('username',email)
},

rules: {


email : {
required: true,
email: true
},

password : {
required: true,
},


},
messages : {

email: {
required: "please enter your email ID",
email: "Please enter a valid email ID"
},

password: {
required: "please enter your password",
},



}
});


// forgot form
$("#forgot_page").validate({

submitHandler: function() {
window.location.href = 'reset_password.html';
},

rules: {


email : {
required: true,
email: true
},


},
messages : {
email: {
required: "please enter your email ID",
email: "Please enter a valid email ID"
},



}
});


// Reset password
$("#resetpasssword_page").validate({

submitHandler: function() {
window.location.href = 'index.html';
},

rules: {


newpassword : {
required: true,
minlength: 8,
mypassword:true
},

confirmpassword:{
equalTo: "#newpassword"
}


},
messages : {

newpassword: {
required: "please enter your password",
minlength: "password should contain min 8 character",
mypassword: "password should contain atleast one number"
},


}
});



// mentor and mentee
$("#role button").on("click", function(){
$(this).toggleClass('btn-primary');
$(this).removeClass('btn-outline-primary');
$(this).next().removeClass('btn-primary').addClass('btn-outline-primary');
$(this).prev().removeClass('btn-primary').addClass('btn-outline-primary');

});








