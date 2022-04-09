const voiceContainer = document.querySelector('.voice-container')
const voiceIcon = document.querySelector('.fa-microphone')
const closeIcon = document.querySelector('#fa-times')
const fileIcon = document.querySelector('.fa-file-upload')
const fileContainer = document.querySelector('.upload-file_container')
const closes = document.querySelector('#file_close')
function open (clicked,con,clo){
  clicked.addEventListener('click',()=>{
    con.classList.add('scale')
    console.log('one')
  })
  clo.addEventListener('click',()=>{
    con.classList.remove('scale')
    con.style.opacity ='0'
  })
}
open(voiceIcon,voiceContainer,closeIcon)
open(fileIcon,fileContainer,closes)
// voiceIcon.addEventListener('click',()=>{
//     voiceContainer.classList.add('scale')
// })
// closeIcon.addEventListener('click',()=>{
//     voiceContainer.classList.remove('scale')
//     voiceContainer.style.opacity ='0'
// })



/////////////////////////////

const recorButton = document.getElementById('recordButton');
const recordButtonImage = recorButton.firstElementChild;
const recordedAudioContainer = document.getElementById('recordedAudioContainer');
const discardAudioButton = document.getElementById('discardButton');
const saveAudioButton = document.getElementById('saveButton');

let chunks = []
let mediaRecorder = null
let audioBlob = null

recorButton.addEventListener('click',record)
function record(){
    //check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support recording!');
        return;
    }
  
  // browser supports getUserMedia
  // change image in button
    recordButtonImage.src = `/images/${mediaRecorder && mediaRecorder.state === 'recording' ? 'microphone' : 'stop-button'}.png`;
    if (!mediaRecorder) {
        // start recording
        navigator.mediaDevices.getUserMedia({audio: true})
        .then((stream) => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            mediaRecorder.ondataavailable = mediaRecorderDataAvailable;
            mediaRecorder.onstop = mediaRecorderStop;
        })
        .catch((err) => {
            alert(`The following error occurred: ${err}`);
            // change image in button
            recordButtonImage.src = '/images/microphone.png';
        });
    } else {
    // stop recording
        mediaRecorder.stop();
    }
}
function mediaRecorderDataAvailable(e) {
    chunks.push(e.data);
  }


function mediaRecorderStop () {
    //check if there are any previous recordings and remove them
    if (recordedAudioContainer.firstElementChild.tagName === 'AUDIO') {
      recordedAudioContainer.firstElementChild.remove();
    }
    //create a new audio element that will hold the recorded audio
    const audioElm = document.createElement('audio');
    audioElm.setAttribute('controls', ''); //add controls
    //create the Blob from the chunks
    audioBlob = new Blob(chunks, { type: 'audio/mp3' });
    const audioURL = window.URL.createObjectURL(audioBlob);
    audioElm.src = audioURL;
    //show audio
    recordedAudioContainer.insertBefore(audioElm, recordedAudioContainer.firstElementChild);
    recordedAudioContainer.classList.add('d-flex');
    recordedAudioContainer.classList.remove('d-none');
    //reset to default
    mediaRecorder = null;
    chunks = [];
  }

  function discardRecording () {
    //show the user the prompt to confirm they want to discard
    if (confirm('Are you sure you want to discard the recording?')) {
      //discard audio just recorded
      resetRecording();
    }
  }
  
function resetRecording () {
        if (recordedAudioContainer.firstElementChild.tagName === 'AUDIO') {
            //remove the audio
            recordedAudioContainer.firstElementChild.remove();
            //hide recordedAudioContainer
            recordedAudioContainer.classList.add('d-none');
            recordedAudioContainer.classList.remove('d-flex');
        }
//reset audioBlob for the next recording
        audioBlob = null;
    }
//add the event listener to the button
discardAudioButton.addEventListener('click', discardRecording);


function saveRecording () {
    //the form data that will hold the Blob to upload
    const formData = new FormData();
    //add the Blob to formData
    formData.append('audio', audioBlob, 'recording.mp3');
    //send the request to the endpoint
    fetch('/record', {
      method: 'POST',
      body: formData
    })
    .then((response) => response.json())
    .then((response) => {
      console.log(response)
      alert("your audio has been saved");
      //reset for next recording
      resetRecording();
      //TODO fetch recordings
    })
    .catch((err) => {
      console.error(err);
      alert("An error occurred, please try again later");
      //reset for next rescording
      resetRecording();
    })
}
  
  //add the event handler to the click event
saveAudioButton.addEventListener('click', saveRecording);

