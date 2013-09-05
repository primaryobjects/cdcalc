function round(num, dec) {
    // Round to dec precision and display dec decimal places.
    return (Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec)).toFixed(dec);
}

function displayCurrency(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10) cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + '$' + num + '.' + cents);
}

function getUrlParameter(name) {
    var result = decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    );

    if (result == 'null') {
        result = null;
    }

    return result;
}

function setControlIfValue(control, value, formatCurrency) {
    if (value) {
        // Check for javascript injection.
        if (value.indexOf('<') == -1 && value.indexOf('>') == -1) {
            $(control).val(value);

            if (formatCurrency) {
                $(control).formatCurrency({ colorize: true });
            }
        }
    }
}

function numericValidation(event) {
    // Allow: backspace, delete, tab, escape, enter, period
    if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || event.keyCode == 190 || event.keyCode == 110 ||
        // Allow: Ctrl+A
        (event.keyCode == 65 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
    }
    else {
        // Ensure that it is a number and stop the keypress
        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
            event.preventDefault();
        }
    }
}
