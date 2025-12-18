function showModal(id) {
    $('#' + id).fadeIn(200);
    $('body').addClass('modal-open');
}

function closeModal(id) {
    $('#' + id).fadeOut(200);
    $('body').removeClass('modal-open');
}

$(document).on('click', '.modal-overlay', function() {
    closeModal($(this).parent().attr('id'));
});
