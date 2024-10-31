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

// Speed up the video when holding the screen
videoPlayer.addEventListener('touchstart', handleSpeedBoost);
videoPlayer.addEventListener('touchend', resetSpeed);

// Double-click to go forward or back
videoPlayer.addEventListener('dblclick', handleDoubleClick);

function handleSpeedBoost() {
    videoPlayer.playbackRate = 4.0; // Increase speed to 4x
}

function resetSpeed() {
    videoPlayer.playbackRate = 1.0; // Reset speed to normal
}

function handleDoubleClick(event) {
    const videoWidth = videoPlayer.offsetWidth;
    const clickPosition = event.offsetX;

    if (clickPosition < videoWidth / 2) {
        // Left side double-click, rewind 2 seconds
        videoPlayer.currentTime = Math.max(0, videoPlayer.currentTime - 2);
    } else {
        // Right side double-click, fast forward 2 seconds
        videoPlayer.currentTime = Math.min(videoPlayer.duration, videoPlayer.currentTime + 2);
    }
}


function addSubtitleEntry() {
    const entry = document.createElement('div');
    entry.classList.add('subtitle-entry');

    const subtitleText = document.createElement('input');
    subtitleText.type = 'text';
    subtitleText.placeholder = 'Subtitle text...';

    // Create a row for Start Time and Set Start Button
    const startRow = document.createElement('div');
    startRow.classList.add('timestamp-row');

    const startTimestamp = document.createElement('input');
    startTimestamp.type = 'text';
    startTimestamp.readOnly = true;
    startTimestamp.placeholder = 'Start Time';

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Set Start';
    startBtn.classList.add('timestamp-btn');
    startBtn.onclick = () => setTimestamp(startTimestamp);

    startRow.appendChild(startTimestamp);
    startRow.appendChild(startBtn);

    // Create a row for End Time and Set End Button
    const endRow = document.createElement('div');
    endRow.classList.add('timestamp-row');

    const endTimestamp = document.createElement('input');
    endTimestamp.type = 'text';
    endTimestamp.readOnly = true;
    endTimestamp.placeholder = 'End Time';

    const endBtn = document.createElement('button');
    endBtn.textContent = 'Set End';
    endBtn.classList.add('timestamp-btn');
    endBtn.onclick = () => {
        setTimestamp(endTimestamp);
        addSubtitleEntry();
    };

    endRow.appendChild(endTimestamp);
    endRow.appendChild(endBtn);

    // Append everything to the entry container
    entry.appendChild(subtitleText);
    entry.appendChild(startRow);
    entry.appendChild(endRow);

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
