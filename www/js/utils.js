function showMessage(message, type = 'success') {
    $('#messageArea').html(`<div class="message ${type}">${message}</div>`);
    setTimeout(() => $('#messageArea').empty(), 3000);
}

function validateContent(content) {
    if (!content || !content.trim()) {
        showMessage('投稿内容を入力してください', 'error');
        return false;
    }
    if (content.length > 1000) {
        showMessage('投稿内容は1000文字以内で入力してください', 'error');
        return false;
    }
    return true;
}

function dateToTimestamp(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr + 'T00:00:00').getTime();
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;')
                      .replace(/</g,'&lt;')
                      .replace(/>/g,'&gt;')
                      .replace(/"/g,'&quot;')
                      .replace(/'/g,'&#039;');
}

function formatTimestamp(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleString('ja-JP');
}

function timestampToDateInput(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}
