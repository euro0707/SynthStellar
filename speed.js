// speed.js - BGM playback rate control with null guards
window.addEventListener('DOMContentLoaded', () => {
    const getAudio = () => document.getElementById('bgm');

    const autoPlay = () => {
        const a = getAudio();
        if (a && a.paused) {
            a.play();
        }
    };

    autoPlay();

    window.incSpeed = () => {
        const a = getAudio();
        if (!a) return;
        a.playbackRate = Math.min(3, a.playbackRate + 0.1);
        console.log('Speed:', a.playbackRate.toFixed(2));
    };

    window.decSpeed = () => {
        const a = getAudio();
        if (!a) return;
        a.playbackRate = Math.max(0.1, a.playbackRate - 0.1);
        console.log('Speed:', a.playbackRate.toFixed(2));
    };

    window.twoXSpeed = () => {
        const a = getAudio();
        if (!a) return;
        a.playbackRate = 2.0;
        console.log('Speed: 2.0');
    };

    window.startBGM = autoPlay;
});
