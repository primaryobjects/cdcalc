$(document).ready(function () {
    // Event handlers.
    $('#btnSubmit').click(function () {
        if ($('#txtAddress').val().length > 0) {
            $('#contactResult').html('Your message has been sent. Thank you.');
            return false;
        }

        return true;
    });
});