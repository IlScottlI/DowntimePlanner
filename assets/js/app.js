

$(document).ready(function () {

    var loading = true;

    $(window).load(function () {
        loading = false;
    }).ajaxStart(function () {
        loading = true;
    }).ajaxComplete(function () {
        loading = false;
    });

});