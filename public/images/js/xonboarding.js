// username
document.getElementById('username').innerHTML=localStorage.getItem('username')


// lets Started
$('.letStarted').click(function(){
$('#lets_started').hide()
$('#onboarding').show()
})


// Custom method to validate username
$.validator.addMethod("usernameRegex", function(value, element) {
return this.optional(element) || /^[a-zA-Z0-9]*$/i.test(value);
}, "Username must contain only letters, numbers");

$(".next").click(function(){
var form = $("#myform");
form.validate({
errorElement: 'span',
errorClass: 'help-block',
highlight: function(element, errorClass, validClass) {
$(element).closest('.form-group').addClass("has-error");
},
unhighlight: function(element, errorClass, validClass) {
$(element).closest('.form-group').removeClass("has-error");
},
rules: {
username: {
required: true,
usernameRegex: true,
minlength: 6,
},
password : {
required: true,
},
conf_password : {
required: true,
equalTo: '#password',
},
company:{
required: true,
},
url:{
required: true,
},
name: {
required: true,
minlength: 3,
},
email: {
required: true,
minlength: 3,
},

},
messages: {
username: {
required: "Username required",
},
password : {
required: "Password required",
},
conf_password : {
required: "Password required",
equalTo: "Password don't match",
},
name: {
required: "Name required",
},
email: {
required: "Email required",
},
}
});
if (form.valid() === true){
if ($('#account_information').is(":visible")){
current_fs = $('#account_information');
next_fs = $('#company_information');
}else if($('#company_information').is(":visible")){
current_fs = $('#company_information');
next_fs = $('#personal_information');
}

next_fs.show();
current_fs.hide();
}
});

$('#previous').click(function(){
if($('#company_information').is(":visible")){
current_fs = $('#company_information');
next_fs = $('#account_information');
}else if ($('#personal_information').is(":visible")){
current_fs = $('#personal_information');
next_fs = $('#company_information');
}
next_fs.show();
current_fs.hide();
});







