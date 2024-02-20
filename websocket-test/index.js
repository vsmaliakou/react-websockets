const btn = document.getElementById('btn');
const socket = new WebSocket('ws://localhost:4000/');

socket.onopen = () => {
  socket.send(JSON.stringify({
    method: 'connection',
    id: 55,
    username: 'vsmaliakou',
  }));
};

socket.onmessage = (event) => {
  console.log('С сервера пришло сообщение', event.data);
};

btn.onclick = () => {
  socket.send(JSON.stringify({
    message: 'Привет',
    method: 'message',
    id: 55,
    username: 'vsmaliakou',
  }));
};
