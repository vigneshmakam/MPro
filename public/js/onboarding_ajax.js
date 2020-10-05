
// call Ajax Function for Experties

var expertiesArray = $.map(experties, function (value, key) { return { value: value, data: key }; });

// Setup jQuery ajax mock:
$.mockjax({
url: '*',
responseTime: 2000,
response: function (settings) {
var query = settings.data.query,
queryLowerCase = query.toLowerCase(),
re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi'),
suggestions = $.grep(expertiesArray, function (country) {
// return country.value.toLowerCase().indexOf(queryLowerCase) === 0;
return re.test(country.value);
}),
response = {
query: query,
suggestions: suggestions
};

this.responseText = JSON.stringify(response);
}
});

$('#experts').autocomplete({
lookup: expertiesArray,
minChars: 1,
onSelect: function (suggestion) { 
$('.expert-areas').append("<p class='exp_val slec_val mr-2'>" + suggestion.value + "<i class='close'>&times;</i>" + "</p>"  );
$(this).val('')
},
onInvalidateSelection: function() {
$('.expert-areas').val(suggestion.value);
},
showNoSuggestionNotice: true,
noSuggestionNotice: 'Sorry, no matching results Select Enter to Add',
groupBy: 'category'
});


$('#experts').keypress(function(e) {
var expertBlank = $('#experts').val()
if(e.which == 13) {
e.preventDefault();
$(this).val('')
$('.expert-areas').append("<p class='exp_val slec_val mr-2'>" + expertBlank + "<i class='close'>&times;</i>" + "</p>");
}
});


// Skills

$('#skill').autocomplete({
lookup: expertiesArray,
minChars: 1,
onSelect: function (suggestion) { 
$('.skill-areas').append("<p class='skill_val slec_val mr-2'>" + suggestion.value + "<i class='close'>&times;</i>" + "</p>"  );
$(this).val('')
},
onInvalidateSelection: function() {
$('.skill-areas').val(suggestion.value);
},
showNoSuggestionNotice: true,
noSuggestionNotice: 'Sorry, no matching results Select Enter to Add',
groupBy: 'category'
});


$('#skill').keypress(function(e) {
var expertBlank = $('#skill').val()
if(e.which == 13) {
e.preventDefault();
$(this).val('')
$('.skill-areas').append("<p class='skill_val slec_val mr-2'>" + expertBlank + "<i class='close'>&times;</i>" + "</p>");
}
});







$('#bio').on("input", function() {
var dInput = this.value;
console.log(dInput);
$('.bio-areas').text(dInput);
});


