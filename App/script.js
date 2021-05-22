const COMNT_BTN    = document.getElementById('post');
const COMNT_TEXT   = document.getElementById('comment');
const COMNTS_LIST  = document.getElementById('commentsList');
const PROCESS_CMNT = 'processing';
var authUser = 'Anonymous';

function handleCommentPost(){
    if(!COMNT_BTN.classList.contains(PROCESS_CMNT)){
        COMNT_BTN.classList.add(PROCESS_CMNT);
        COMNT_TEXT.classList.add(PROCESS_CMNT);
        let currentCmnt = COMNT_TEXT.innerText;
        console.log(currentCmnt)
    }
}

COMNT_BTN.addEventListener('click',handleCommentPost)