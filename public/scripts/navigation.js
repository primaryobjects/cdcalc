function setActiveTab(tabId) {
    // Remove active flag from all tabs.
    $('#home').removeClass('active');
    $('#about').removeClass('active');
    $('#contact').removeClass('active');

    // Set active tab.
    $('#' + tabId).addClass('active');
}