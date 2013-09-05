$(document).ready(function () {
    // Field validation.
    $('#txtDeposit').formatCurrency();
    $('#txtDeposit').blur(function () {
        $(this).formatCurrency({ colorize: true });
    });

    $('#txtDeposit').keydown(function (event) {
        numericValidation(event);
    });

    $('#txtAPY').keydown(function (event) {
        numericValidation(event);
    });

    $('#txtPenaltyDays').keydown(function (event) {
        numericValidation(event);
    });

    $('#txtDuration').keydown(function (event) {
        numericValidation(event);
    });

    // Event handlers.
    $('#btnSubmit').click(function () {
        // Record event in Google Analytics.
        var key = $('#txtDeposit').val() + ', ' + $('#txtAPY').val() + ', ' + $('#lstCompound').val() + ', ' + $('#txtPenaltyDays').val() + ', ' + $('#txtDuration').val() + ', ' + $('#txtName').val();
        _gaq.push(['_trackEvent', 'btnSubmit', 'Click', key]);

        onCalculate();
        return false;
    });

    $('#txtDuration').change(function () {
        var name = $('#txtName').val();
        if (name.indexOf('My Bank') != -1 && name.indexOf('-Year CD') != -1) {
            // This is the default name text, so update it with the new duration selected.
            var duration = round($('#txtDuration').val() / 12, 0);
            name = 'My Bank ' + duration + '-Year CD';
            $('#txtName').val(name);
        }
    });

    // Update tooltips.
    $('[rel=tooltip]').tooltip();

    // Check url parameters.
    var deposit = getUrlParameter('d');
    setControlIfValue('#txtDeposit', deposit, true);
    var interest = getUrlParameter('i');
    setControlIfValue('#txtAPY', interest);
    var compound = getUrlParameter('c');
    setControlIfValue('#lstCompound', compound);
    var penalty = getUrlParameter('p');
    setControlIfValue('#txtPenaltyDays', penalty);
    var duration = getUrlParameter('t');
    setControlIfValue('#txtDuration', duration);
    var name = getUrlParameter('n');
    setControlIfValue('#txtName', name);

    // Auto-calculate, if all data is provided in the url.
    if (deposit && interest && penalty && duration) {
        onCalculate();
    }

    $('.dropdown-toggle').dropdown();

    // Set any #top link to scroll to top of page.
    $("a[href='/#top']").click(function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");

        // Set focus to deposit input field.
        $('#txtDeposit').focus();

        return false;
    });

    // Set focus to deposit input field.
    $('#txtDeposit').focus();
});