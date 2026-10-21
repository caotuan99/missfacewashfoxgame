// Realtime Peer-to-Peer Network Manager using PeerJS
class NetworkManager {
    constructor() {
        this.peer = null;
        this.conn = null;
        this.isHost = false;
        this.roomCode = null;
        this.isConnected = false;
        this.handlers = {};

        this.lastSentPos = { x: 0, y: 0, z: 0, rot: 0 };
    }

    on(event, callback) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(callback);
    }

    emit(event, data) {
        if (this.handlers[event]) {
            this.handlers[event].forEach(cb => cb(data));
        }
    }

    generateCode() {
        const adjectives = ['LOVE', 'SWEET', 'HONEY', 'COZY', 'CUTE', 'PINK', 'WARM', 'STAR'];
        const num = Math.floor(10 + Math.random() * 90);
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        return `${adj}${num}`;
    }

    hostRoom(onReady) {
        this.isHost = true;
        this.roomCode = this.generateCode();
        const peerId = `cozyfarm-${this.roomCode.toLowerCase()}`;

        try {
            this.peer = new Peer(peerId, {
                debug: 1
            });
        } catch (e) {
            console.error('Peer creation error:', e);
            this.emit('error', 'Không thể khởi tạo mạng P2P');
            return;
        }

        this.peer.on('open', (id) => {
            console.log('Host opened peer:', id);
            if (onReady) onReady(this.roomCode);
            this.emit('hosted', this.roomCode);
        });

        this.peer.on('connection', (conn) => {
            console.log('Guest connected!');
            this.conn = conn;
            this.setupConnection();
        });

        this.peer.on('error', (err) => {
            console.error('PeerJS error:', err);
            if (err.type === 'unavailable-id') {
                // Try again with different code
                this.hostRoom(onReady);
            } else {
                this.emit('error', err.message || 'Lỗi kết nối phòng');
            }
        });
    }

    joinRoom(code, onConnected) {
        this.isHost = false;
        this.roomCode = code.toUpperCase().trim();
        const peerId = `guest-${Math.random().toString(36).substring(2, 7)}`;
        const targetId = `cozyfarm-${this.roomCode.toLowerCase()}`;

        try {
            this.peer = new Peer(peerId, {
                debug: 1
            });
        } catch (e) {
            console.error('Peer creation error:', e);
            this.emit('error', 'Không thể khởi tạo mạng');
            return;
        }

        this.peer.on('open', () => {
            console.log('Connecting to host:', targetId);
            this.conn = this.peer.connect(targetId, { reliable: true });
            this.setupConnection(onConnected);
        });

        this.peer.on('error', (err) => {
            console.error('PeerJS join error:', err);
            this.emit('error', 'Không tìm thấy phòng hoặc mã không đúng!');
        });
    }

    setupConnection(onConnected) {
        this.conn.on('open', () => {
            console.log('P2P Connection established!');
            this.isConnected = true;
            this.emit('connected', { isHost: this.isHost, roomCode: this.roomCode });
            if (onConnected) onConnected();

            // If we are guest, ask host for current game state
            if (!this.isHost) {
                this.send({ type: 'REQUEST_SYNC' });
            }
        });

        this.conn.on('data', (data) => {
            if (data && data.type) {
                this.emit(data.type, data.payload);
            }
        });

        this.conn.on('close', () => {
            console.log('Connection closed');
            this.isConnected = false;
            this.emit('disconnected');
        });

        this.conn.on('error', (err) => {
            console.error('Connection data error:', err);
            this.emit('error', 'Mất kết nối với người chơi!');
        });
    }

    send(data) {
        if (this.conn && this.conn.open) {
            this.conn.send(data);
        }
    }

    sendPosition(x, y, z, rotY, isMoving) {
        if (!this.isConnected) return;
        this.send({
            type: 'PLAYER_MOVE',
            payload: { x, y, z, rotY, isMoving }
        });
    }

    sendAction(actionType, payload = {}) {
        if (!this.isConnected) return;
        this.send({
            type: actionType,
            payload: payload
        });
    }
}

window.networkManager = new NetworkManager();
