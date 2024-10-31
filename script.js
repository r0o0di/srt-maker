document.getElementById('videoUpload').addEventListener('change', handleVideoUpload);
document.getElementById('addSubtitleBtn').addEventListener('click', addSubtitleEntry);
document.getElementById('downloadSrtBtn').addEventListener('click', downloadSrtFile);

const videoPlayer = document.getElementById('videoPlayer');
let subtitleLines = [];
let entryCounter = 1;

function handleVideoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    videoPlayer.src = URL.createObjectURL(file);
    videoPlayer.load();
  }
}

function addSubtitleEntry() {
  const entry = document.createElement('div');
  entry.classList.add('subtitle-entry');

  const subtitleText = document.createElement('input');
  subtitleText.type = 'text';
  subtitleText.placeholder = 'Subtitle text...';

  const startTimestamp = document.createElement('input');
  startTimestamp.type = 'text';
  startTimestamp.readOnly = true;
  startTimestamp.placeholder = 'Start Time';
  startTimestamp.id = "startTime";

  const startBtn = document.createElement('button');
  startBtn.textContent = 'Set Start';
  startBtn.classList.add('timestamp-btn');
  startBtn.onclick = () => setTimestamp(startTimestamp);

  const endTimestamp = document.createElement('input');
  endTimestamp.type = 'text';
  endTimestamp.readOnly = true;
  endTimestamp.placeholder = 'End Time';
  endTimestamp.id = "endTime";

  const endBtn = document.createElement('button');
  endBtn.textContent = 'Set End';
  endBtn.classList.add('timestamp-btn');
  endBtn.onclick = () => setTimestamp(endTimestamp);

  entry.appendChild(subtitleText);
  entry.appendChild(startTimestamp);
  entry.appendChild(startBtn);
  entry.appendChild(endTimestamp);
  entry.appendChild(endBtn);

  document.getElementById('subtitleContainer').appendChild(entry);

  subtitleLines.push({ subtitleText, startTimestamp, endTimestamp });
}

function setTimestamp(inputField) {
  inputField.value = formatTimestamp(videoPlayer.currentTime);
}

function formatTimestamp(time) {
  const date = new Date(time * 1000);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
  return `${hours}:${minutes}:${seconds},${milliseconds}`;
}

function downloadSrtFile() {
  const fileName = document.getElementById('fileName').value || 'subtitles';
  let srtContent = '';

  subtitleLines.forEach((line, index) => {
    const start = line.startTimestamp.value;
    const end = line.endTimestamp.value;
    const text = line.subtitleText.value;
    if (start && end && text) {
      srtContent += `${index + 1}\n${start} --> ${end}\n${text}\n\n`;
    }
  });

  const blob = new Blob([srtContent], { type: 'text/srt' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.srt`;
  a.click();
  URL.revokeObjectURL(url);
}
