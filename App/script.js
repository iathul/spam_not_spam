import * as DICTIONARY from '/dictionary.js'

var socket = io.connect();

const ENCODING_LENGTH = 20;

function tokenize(wordArray){

    let returnArray = [DICTIONARY.START];

    for (var i = 0; i < wordArray.length; i++) {
        let encoding = DICTIONARY.LOOKUP[wordArray[i]];
        returnArray.push(encoding === undefined ? DICTIONARY.UNKNOWN : encoding);
    }

    while (i < ENCODING_LENGTH - 1) {
        returnArray.push(DICTIONARY.PAD);
        i++;
    }

    console.log([returnArray]);
    return tf.tensor([returnArray]);
}

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

        let toLowerArray = currentCmnt.toLowerCase().replace(/[^\w\s]/g, ' ').split(' ');
        let li = document.createElement('li');

        loadAndPredict(tokenize(toLowerArray),li).then(function(){
            COMNT_BTN.classList.remove(PROCESS_CMNT);
            COMNT_TEXT.classList.remove(PROCESS_CMNT);

            let p = document.createElement('p');
            p.innerText = COMNT_TEXT.innerText;

            let spanName = document.createElement('span');
            spanName.setAttribute('class', 'username');
            spanName.innerText = authUser;

            let spanDate = document.createElement('span');
            spanDate.setAttribute('class', 'timestamp');
            let curDate = new Date();
            spanDate.innerText = curDate.toLocaleString();

            li.appendChild(spanName);
            li.appendChild(spanDate);
            li.appendChild(p);
            COMNTS_LIST .prepend(li);
      
            COMNT_TEXT.innerText = '';

        });

    }
}

COMNT_BTN.addEventListener('click',handleCommentPost);

const MODEL_JSON_URL = 'model.json';
const SPAM_THRESHOLD = 0.75;

var model = undefined;

async function loadAndPredict(inputTensor,domComment){
    if(model === undefined){
        model = await tf.loadLayersModel(MODEL_JSON_URL);
    }

    var results = await model.predict(inputTensor);
    
    results.data().then((dataArray)=>{
        if (dataArray[1] > SPAM_THRESHOLD) {
          domComment.classList.add('spam');
        }else {
            socket.emit('comment',{
                username: authUser,
                timestamp: domComment.querySelectorAll('span')[1].innerText,
                comment: domComment.querySelectorAll('p')[0].innerText
            })
        }
    })
}

function handleRemoteComments(data) {
    let li = document.createElement('li');
    let p = document.createElement('p');
    p.innerText = data.comment;
  
    let spanName = document.createElement('span');
    spanName.setAttribute('class', 'username');
    spanName.innerText = data.username;
  
    let spanDate = document.createElement('span');
    spanDate.setAttribute('class', 'timestamp');
    spanDate.innerText = data.timestamp;
  
    li.appendChild(spanName);
    li.appendChild(spanDate);
    li.appendChild(p);
    
    COMNTS_LIST .prepend(li);
}

socket.on('remoteComment', handleRemoteComments);