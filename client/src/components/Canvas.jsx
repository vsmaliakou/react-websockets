import { observer } from 'mobx-react-lite';
import '../styles/canvas.scss';
import { useEffect, useRef, useState } from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import Rect from '../tools/Rect';
import axios from 'axios';

const Canvas = observer(() => {
  const canvasRef = useRef();
  const usernameRef = useRef();
  const [modal, setModal] = useState(true);
  const params = useParams();

  const mourseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
    axios.post(`http://localhost:4000/image?id=${params.id}`, { img: canvasRef.current.toDataURL() })
      .then(response => console.log(response.data));
  };

  const connectionHandler = () => {
    canvasState.setUsername(usernameRef.current.value);
    setModal(false);
  };

  const drawHandler = (msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext('2d');

    switch (figure.type) {
      case 'brush': {
        Brush.draw(ctx, figure.x, figure.y);
        break;
      }
      case 'rect': {
        Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color);
        break;
      }
      case 'finish': {
        ctx.beginPath();
        break;
      }
      default: {
        break;
      }
    }
  };

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    const ctx = canvasRef.current.getContext('2d');
    axios.get(`http://localhost:4000/image?id=${params.id}`)
      .then((response) => {
        const img = new Image();
          img.src = response.data;
          img.onload = () => {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
          };
      });
  }, []);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket('ws://localhost:4000/');
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id);
      toolState.setTool(new Brush(canvasRef.current, socket, params.id));
      socket.onopen = () => {
        socket.send(JSON.stringify({
          id: params.id,
          username: canvasState.username,
          method: 'connection',
        }));
      };
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);

        switch (msg.method) {
          case 'connection': {
            console.log(`Пользователь ${msg.username} подключен`);
            break;
          }
          case 'draw': {
            drawHandler(msg);
            break;
          }
          default: {
            break;
          }
        }
      };
    }
  }, [canvasState.username]);

  return (
    <div className="canvas">
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" ref={usernameRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => connectionHandler()}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas
        onMouseDown={() => mourseDownHandler()}
        ref={canvasRef}
        width={600}
        height={400}
      />
    </div>
  );
});

export default Canvas;