// username
document.getElementById('username').innerHTML=localStorage.getItem('username')




// lets Started
$('.letStarted').click(function(){
$('#lets_started').hide()
$('#onboarding').show()
})



// area of experties:
$(".tagging").select2({
placeholder: "Make a Selection",
allowClear: true,
tags: true,
});


$(".daysavaliable").select2({
placeholder: "Choose your avaliablity",
allowClear: true,
tags: false,
});


$(".time").select2({
placeholder: "Select your time ",
allowClear: true,
tags: false,
closeOnSelect : false,
});


$(".timezone").select2({
allowClear: false,
tags: false,
closeOnSelect : true,
});
    


$("#_details").validate({

submitHandler: function() {
$('.tab_one').hide()
$('.tab_two').show()
},

rules: {
experties : {
required: true,
},

skills : {
required: true,
},

daysavaliable : {
required: true,
},

timezone : {
required: true,
},

time : {
required: true,
},

},

messages : {
experties: {
required: "Please select your area of experties",
},

skills: {
required: "Please choose your skills",
},

daysavaliable: {
required: "Please select your avaliablity",
},

timezone: {
required: "Please select your timezone",
},

time: {
required: "Please select your avaliable time",
},




}


});



// end of  area of experties:

    



// Eduational and professional details

$(".education_details").select2({ 
tags: false,
});




$("#eduprof_details").validate({

submitHandler: function() {
$('.tab_two').hide()
$('.tab_three').show()

},


rules: {

highest_qual : {
required: true,
},

currentcomp:{
required: true,
}
        
},

messages : {

highest_qual: {
required: "Please select your highest qualification",
},

currentcomp: {
required: "Please enter your company name",
},

}


});
    


$('.addmore').on('click', function(){
$('.addmorelist').append(" <div class='col-lg-8 mt-3'><input type='text' class='form-control' placeholder='Certification Name' aria-label='role'></div><div class='col-lg-4 mt-3'><input type='date' class='form-control' placeholder='Enter your College/university name' aria-label='role'></div>")

})
    


$('.tab_two button#prev').on('click', function(){
$('.tab_two').hide()
$('.tab_one').show()
})


    
// end of  Eduational and professional details




// Personal Details

$(".personal_common").select2({ 
tags: true,
});
    


$("#personal_details").validate({

submitHandler: function() {
$('.tab_three').hide()
window.location.href = 'verify_email.html';

},


rules: {
dob:{
required:true,
},

gender:{
required:true,
},

country:{
required:true,
},

city:{
required:true,
},
    

},

messages : {
dob:{
required:"Enter your DOB",
},

gender:{
required:"Select your gender",
},

country:{
required:"Select your country",
},

city:{
required:"Select your city",
},


}


});


$('.tab_three button#prev').on('click', function(){
$('.tab_three').hide()
$('.tab_two').show()
})
















