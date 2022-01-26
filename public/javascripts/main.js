const producerName = document.getElementById("producer");
const songName = document.getElementById("song");
const albumName = document.getElementById("album");
const recordLabelName = document.getElementById("label");
const img = document.getElementsByTagName("img")[0];
const beatList = document.getElementsByTagName("li");
const progressBar = document.getElementById("progressBar");
const progress = document.getElementById("progress");
const card = document.querySelectorAll(".card")[2];

const musicPlayer = {

    identifyBeat: event => {
        const producer = event.target.getAttribute("artist");
        const song  = event.target.getAttribute("song");
        const album = event.target.getAttribute("album");
        const recordLabel = event.target.getAttribute("recordLabel");
        const coverImg = event.target.getAttribute("cover");

        producerName.innerHTML = `<h4>Producer Name: ${producer}</h4>`;
        songName.innerHTML = `<h4>Beat Name: ${song}</h4>`;
        albumName.innerHTML = `<h4>Album Name: ${album}</h4>`
        recordLabelName.innerHTML = `<h4>Record Label: ${recordLabel}</h4>`;
        img.src = coverImg;
    },

    stopBeat: () => {
        for (let i = 0; i < beatList.length; i++) {
            beatList.item(i).lastElementChild.pause();
            beatList.item(i).lastElementChild.currentTime = 0;
        }
    },

    dynamicWidth: event => {
        const beatDuration = event.target.nextElementSibling.duration;
        const beatCurrentTime = event.target.nextElementSibling.currentTime;
        const beatWidth = document.getElementById("progressBar").offsetWidth;
        const constantDuration = beatDuration / beatDuration;
        const beatProgression = (beatWidth / beatDuration * beatCurrentTime) / (constantDuration * 1.008);
        return beatProgression;
    },

    playBeat: event => {
        const beatTime = event => {
            let duration = document.getElementById("duration");
            let progress = document.getElementById("progress");
            let s = parseInt(event.target.nextElementSibling.currentTime % 60);
            let m = parseInt(event.target.nextElementSibling.currentTime / 60) % 60;

            if (s < 10) {
                s = `0${s}`;
            }

            duration.innerHTML = `${m}:${s}`;
            progress.style.width = Math.floor(musicPlayer.dynamicWidth(event)) + "px";
        }

        event.target.nextElementSibling.ontimeupdate = function() {beatTime(event)};
        event.target.nextElementSibling.play();
    },

    activate: event => {
        const classAtt = document.createAttribute("class");
        const beatToBePlayed = event.target;
        classAtt.value = "activate";
        beatToBePlayed.setAttributeNode(classAtt);
    },

    deactivate: () => {
        for (let i = 0; i < beatList.length; i++) {
            beatList.item(i).firstElementChild.removeAttribute("class");
        }
    }
}


for (let i = 0; i < beatList.length; i++) {
    beatList.item(i).addEventListener("click", event => {
        musicPlayer.stopBeat();
        musicPlayer.deactivate(event);
        musicPlayer.identifyBeat(event);
        musicPlayer.activate(event);
        musicPlayer.playBeat(event);
    });
}

progressBar.addEventListener("mousedown", event => {
    seeking = true;
    seek(event);
});

progressBar.addEventListener("mousemove", event => {
    seek(event);
});

progressBar.addEventListener("mouseup", () => {
    seeking = false;
})

const seek = event => {
    if (seeking) {
        const cardPadding = (card.offsetWidth - (progressBar.parentElement.offsetWidth + duration.parentElement.offsetWidth)) / 2;
        const progressBarPadding = (progressBar.parentElement.offsetWidth - progressBar.offsetWidth) / 2;
        const newDuration = (progressBarPadding * 2) + duration.offsetWidth + cardPadding + progressBar.offsetWidth
        const seek = event.clientX - (card.offsetLeft + cardPadding + (progressBarPadding * 1.199));
        progress.style.width = Math.floor(seek) + "px";

        for (let i = 0; i < beatList.length; i++) {
            if (beatList.item(i).lastElementChild.currentTime !== 0) {
                const seekTo = beatList.item(i).lastElementChild.duration * (seek / (progressBar.offsetWidth * .9905));
                beatList.item(i).lastElementChild.currentTime = seekTo;
                break;
            }
        }
    }
}