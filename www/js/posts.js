function createPost(title, content) {
    if (isPosting) return;
    if (!currentUser) {
        showMessage('投稿するにはログインが必要です', 'error');
        return;
    }
    if (!validateContent(content)) return;

    isPosting = true;
    $('#postButton').prop('disabled', true);

    postsRef.push({
        title,
        content,
        author: currentUser.email,
        userId: currentUser.uid,
        dayStart: dateToTimestamp($('#dayStart').val()),
        dayEnd: dateToTimestamp($('#dayEnd').val()),
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        showMessage('投稿が完了しました');
        $('#contentInput,#titleInput,#dayStart,#dayEnd').val('');
    }).catch(e => {
        showMessage(e.message, 'error');
    }).finally(() => {
        isPosting = false;
        $('#postButton').prop('disabled', false);
    });
}

function createPostElement(post) {
    if (!post || !post.id) return '';
    const canEdit = currentUser && post.userId === currentUser.uid;
    return `
    <div class="post" id="post-${post.id}" data-title="${escapeHtml(post.title || '')}" data-day-start="${post.dayStart || ''}" data-day-end="${post.dayEnd || ''}">
        <div class="post-header">
            <span class="post-title">${escapeHtml(post.title || 'タイトルなし')}</span>
            ${canEdit ? `
            <div class="post-actions">
                <button class="btn-edit" onclick="startEdit('${post.id}')">編集</button>
                <button class="btn-delete" onclick="deletePost('${post.id}')">削除</button>
            </div>` : ''}
        </div>
        <div class="post-meta">
            <span class="post-date">${post.dayStart && post.dayEnd ? `${timestampToDateInput(post.dayStart)} ~ ${timestampToDateInput(post.dayEnd)}` : ''}</span>
        </div>
        <div class="post-content">${escapeHtml(post.content || '内容なし')}</div>
        <div class="post-footer">
            <span class="post-time">${post.timestamp ? formatTimestamp(post.timestamp) : ''}</span>
        </div>
    </div>`;
}

function loadPosts() {
    // 기존 리스너 완전 해제
    postsRef.off('value');
    
    // 새 리스너 설정
    postsRef.on('value', snap => {
        const posts = [];
        const data = snap.val();
        if (data) {
            Object.keys(data).forEach(key => {
                posts.push({ id: key, ...data[key] });
            });
        }
        posts.sort((a,b)=>b.timestamp-a.timestamp);
        console.log('로드된 게시글 수:', posts.length, 'posts:', posts);
        $('#postsList').empty().html(posts.map(createPostElement).join(''));
    });
}

function startEdit(id) {
    currentEditId = id;
    $('#editContent').val($(`#post-${id} .post-content`).text());
    const $el = $(`#post-${id}`);
    $('#editTitle').val($el.attr('data-title') || '');
    const dsTs = parseInt($el.attr('data-day-start')) || null;
    const deTs = parseInt($el.attr('data-day-end')) || null;
    $('#editDayStart').val(dsTs ? timestampToDateInput(dsTs) : '');
    $('#editDayEnd').val(deTs ? timestampToDateInput(deTs) : '');
    showModal('editModal');
}

function handleUpdate() {
    const content = $('#editContent').val();
    if (!validateContent(content)) return;

    const dayStartVal = $('#editDayStart').val();
    const dayEndVal = $('#editDayEnd').val();
    const updateObj = {
        title: $('#editTitle').val(),
        content,
        dayStart: dateToTimestamp(dayStartVal),
        dayEnd: dateToTimestamp(dayEndVal),
        updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    postsRef.child(currentEditId).update(updateObj).then(() => {
        showMessage('更新しました');
        closeModal('editModal');
    });
}

function deletePost(id) {
    currentEditId = id;
    showModal('deleteModal');
}

function handleDelete() {
    postsRef.child(currentEditId).remove().then(() => {
        showMessage('削除しました');
        closeModal('deleteModal');
        loadPosts();
    });
}
