let localStream;
let remoteStream;
let peerConnection;
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

document.getElementById('startCallBtn').addEventListener('click', startCall);
document.getElementById('shareScreenBtn').addEventListener('click', shareScreen);

async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
        document.getElementById('localVideo').srcObject = localStream;
        peerConnection = new RTCPeerConnection(config);
        peerConnection.ontrack = event => {
            document.getElementById('remoteVideo').srcObject = event.streams[0];
        };
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    } catch (error) {
        alert('Ошибка при доступе к медиа устройствам. Проверьте разрешения браузера.');
        console.error('Ошибка при доступе к медиа устройствам:', error);
    }
}

async function shareScreen() {
    try {
        if (!peerConnection) {
            alert('Сначала начните звонок!');
            return;
        }
        let screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        let sender = peerConnection.getSenders().find(s => s.track.kind === 'video');
        if (sender) {
            sender.replaceTrack(screenStream.getVideoTracks()[0]);
        } else {
            console.error('Пир соединение не установлено');
        }
    } catch (error) {
        alert('Ошибка при захвате экрана. Проверьте разрешения браузера.');
        console.error('Ошибка при захвате экрана:', error);
    }
}
