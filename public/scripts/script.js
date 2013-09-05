function onCalculate() {
    // Calculate results.
    var deposit = $('#txtDeposit').toNumber().val();
    var apy = $('#txtAPY').toNumber().val() / 100;
    var penaltyDays = $('#txtPenaltyDays').toNumber().val();
    var duration = $('#txtDuration').toNumber().val();
    var compoundValue = $('#lstCompound').val();
    var futureValue = parseFloat(deposit);
    var interestRates = [];
    var interestNoPenaltyRates = [];

    var daysInMonth = 30;
    var compoundTerm = 365; // 365 = daily, 12 = monthly, 4 = quarterly, 1 = annually
    if (compoundValue == 'Monthly') {
        compoundTerm = 12;
    }
    else if (compoundValue == 'Quarterly') {
        compoundTerm = 4;
    }
    else if (compoundValue == 'Semi-Annually') {
        compoundTerm = 2;
    }
    else if (compoundValue == 'Annually') {
        compoundTerm = 1;
    }

    var interestRate = round(((Math.pow((1 + apy), (1 / compoundTerm)) - 1) * compoundTerm) * 100, 2) / 100; // Convert APY to APR
    var interestPerYear = (deposit * (Math.pow((1 + (interestRate / compoundTerm)), (compoundTerm * 1)))) - deposit;
    var interestPerMonth = ((deposit * (Math.pow((1 + (interestRate / compoundTerm)), (compoundTerm * 1)))) - deposit) / 12;
    var penalty = ((interestPerYear / 365) * penaltyDays) * -1;

	// Set top header calculations.
    $('#interestPerYear').text(displayCurrency(round(interestPerYear, 2)));
    $('#interestPerMonth').text(displayCurrency(round(interestPerMonth, 2)));
    $('#penalty').text(displayCurrency(round(penalty, 2)));

    // Clear the table results.
    $('#results-table').find("tr:gt(0)").remove();

	// Display a row in the table for each month of the CD.
    for (var month = 1; month <= duration; month++) {
        var row = '<tr';
        if (month % 12 == 0) {
            row += ' class="success"';
        }
        row += '>';

        // Calculate values.
        var year = Math.ceil(month / 12);
        var yearMonths = year * 12;
        var interestNoPenalty = ((((deposit * Math.pow((1 + (interestRate / compoundTerm)), (compoundTerm * year))) - deposit) / yearMonths) * month);
        var rateNoPenaltyAPR = interestNoPenalty / deposit;
        var rateNoPenaltyAPY = Math.pow(1 + (rateNoPenaltyAPR / compoundTerm), compoundTerm) - 1;
        if (rateNoPenaltyAPY > apy) {
            rateNoPenaltyAPY = apy;
        }
        var rateNoPenaltyAPYAnnualized = rateNoPenaltyAPR * (yearMonths / month);
        if (rateNoPenaltyAPYAnnualized > apy) {
            rateNoPenaltyAPYAnnualized = apy;
        }
        var interest = interestNoPenalty + penalty;
        var rate = rateNoPenaltyAPYAnnualized * ((month * daysInMonth) - penaltyDays) / (month * daysInMonth);

		// If this is the last month of the CD duration, set the full interest amount and yield.
        if (month == duration) {
            interest = interestNoPenalty;
            rate = rateNoPenaltyAPYAnnualized;
            futureValue += interest;
        }

        row += '<td>' + month + '</td>\n';
        row += '<td>' + displayCurrency(round(interest, 2)) + '</td>\n';
        row += '<td>' + round(rate * 100, 2) + '%</td>\n';
        row += '<td>' + displayCurrency(round(interestNoPenalty, 2)) + '</td>\n';
        row += '<td>' + round(rateNoPenaltyAPYAnnualized * 100, 2) + '%</td>\n';

        row += '</tr>\n';

		// Append the row to the table.
        $('#results-table tr:last').after(row);

        interestRates.push(parseFloat(round(rate * 100, 2)));
        interestNoPenaltyRates.push(parseFloat(round(rateNoPenaltyAPYAnnualized * 100, 2)));
    }

    // Show the permalink.
    $('#permalinkDiv').show();
    $('.permalink').attr('href', '/?d=' + deposit + '&i=' + $('#txtAPY').toNumber().val() + '&c=' + compoundValue + '&p=' + penaltyDays + '&t=' + duration + '&n=' + escape($('#txtName').val()) + '#report');
    $('#txtDeposit').formatCurrency({ colorize: true });

    // Set summary name.
    $('#summaryName').text($('#txtName').val());

    // Set summary.
    var summaryText = $('#txtDeposit').val() + ' @ ' + (round(interestRate * 100, 2)) + '% (' + round((apy * 100), 2) + '% APY) for ' + duration + ' months';
    $('#summary').text(summaryText);

    $('#summaryTotalDiv').show();
    $('#summaryTotal').text(displayCurrency(round(futureValue, 2)));

    // Set page title.
    document.title = 'CD Early Withdrawal Calculator: ' + $('#txtName').val() + ' - ' + summaryText;

    // Plot a graph with the interest rates.
    renderGraph(interestRates, interestNoPenaltyRates);

    // Scroll down to report.
    document.location = '#report';
}

function renderGraph(interestRates, interestNoPenaltyRates) {
    $('#graph').empty();
    
    var plot2 = $.jqplot('graph', [interestRates, interestNoPenaltyRates], {
        // Give the plot a title.
        title: 'Effective APY for Duration of CD',
        // You can specify options for all axes on the plot at once with
        // the axesDefaults object.  Here, we're using a canvas renderer
        // to draw the axis label which allows rotated text.
        axesDefaults: {
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        },
        // An axes object holds options for all axes.
        // Allowable axes are xaxis, x2axis, yaxis, y2axis, y3axis, ...
        // Up to 9 y axes are supported.
        axes: {
            // options for each axis are specified in seperate option objects.
            xaxis: {
                label: "Month",
                // Turn off "padding".  This will allow data point to lie on the
                // edges of the grid.  Default padding is 1.2 and will keep all
                // points inside the bounds of the grid.
                pad: 0
            },
            yaxis: {
                label: "APY",
                min: interestRates[0],
                max: interestNoPenaltyRates[0]
            }
        },
        series: [
            { label: 'APY With Penalty' },
            { label: 'APY No Penalty' }
        ],
        legend: {
            show: true,
            location: 'se',     // compass direction, nw, n, ne, e, se, s, sw, w.
            xoffset: 12,        // pixel offset of the legend box from the x (or x2) axis.
            yoffset: 12,        // pixel offset of the legend box from the y (or y2) axis.
        }
    });
}