const socket = new WebSocket("wss://YOUR_SERVER_URL"); // Подключение к WebSocket-серверу

let localStream;
let peerConnection;
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

document.getElementById('startCallBtn').addEventListener('click', startCall);
document.getElementById('shareScreenBtn').addEventListener('click', shareScreen);

socket.onmessage = async (message) => {
    let data = JSON.parse(message.data);
    
    if (data.type === "offer") {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        let answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: "answer", answer }));
    } else if (data.type === "answer") {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.type === "candidate") {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
};

async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById('localVideo').srcObject = localStream;

        peerConnection = new RTCPeerConnection(config);
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socket.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
            }
        };

        peerConnection.ontrack = event => {
            document.getElementById('remoteVideo').srcObject = event.streams[0];
        };

        let offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.send(JSON.stringify({ type: "offer", offer }));

    } catch (error) {
        alert('Ошибка при доступе к камере/микрофону.');
        console.error(error);
    }
}

async function shareScreen() {
    try {
        if (!peerConnection) {
            alert('Сначала начните звонок!');
            return;
        }
        let screenStream = await navigator.mediaDevices.getDisplayMedia({ video
