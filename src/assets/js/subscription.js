"use strict";

$(".billing-information").on('click', function () {
    $(".billing-information-modal").css("display", "flex");
    $(".billing-modal-container").show();
});
$(".modal-close-btn").on('click', function () {
    $(".billing-information-modal, .upgradePlan-information-modal").css("display", "none");
});
// Close modal when click outside of the modal
$(document).on("mousedown", function (e) {
    if (
        !(
            $(e.target).closest("#billing-modal-main").length > 0 ||
            $(e.target).closest(".billing-information").length > 0
        )
    ) {
        $(".billing-information-modal, .upgradePlan-information-modal").css("display", "none");
    }
});
$(".upgrade-plan").on('click', function () {
    $(".upgradePlan-information-modal").css("display", "flex");
    $(".upgradePlan-modal-container").show();
});