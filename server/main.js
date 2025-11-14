import { WebSocketServer } from "ws";
import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json()); // Add JSON body parser

let wss = null;

function initWebSocketServer(_server) {
  wss = new WebSocketServer({ server: _server, path: '/ws' }); // Fixed: use _server parameter

  wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  console.log(
    "\n\x1b[32m[ OK ]\x1b[0m Web socket service initialized"
  );
}

function broadcastToClients(message) {
  if (!wss) return;
  
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}

app.post("/broadcast", (req, res) => { // Fixed: use req.body.message
  broadcastToClients(req.body.message);
  res.sendStatus(200);
});

app.get("/", (_, res) => {
  res.type("html").send(`
    <!doctype html>
    <html>
    <head>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        
        .remote {
          background: linear-gradient(145deg, #2d3748, #1a202c);
          padding: 3rem 2.5rem;
          border-radius: 32px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        button {
          font-size: 3rem;
          font-weight: 700;
          padding: 1.5rem 3rem;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
          text-transform: uppercase;
          letter-spacing: 2px;
          box-shadow: 
            0 8px 16px rgba(0, 0, 0, 0.3),
            inset 0 -2px 8px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        button:active {
          transform: translateY(2px);
          box-shadow: 
            0 4px 8px rgba(0, 0, 0, 0.3),
            inset 0 -2px 8px rgba(0, 0, 0, 0.2);
        }
        
        button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        button:hover::before {
          left: 100%;
        }
        
        #power {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          width: 100%;
          font-size: 3.5rem;
        }
        
        #power:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }
        
        .controls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .column {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        #upTen, #downTen {
          background: linear-gradient(135deg, #10b981, #059669);
        }
        
        #upTen:hover, #downTen:hover {
          background: linear-gradient(135deg, #059669, #047857);
        }
        
        #up, #down {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }
        
        #up:hover, #down:hover {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }
        
        .label {
          position: absolute;
          top: 0.5rem;
          right: 1rem;
          font-size: 1rem;
          opacity: 0.7;
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <div class="remote">
        <button id="power">
          <span class="label">⏻</span>
          Power
        </button>
        <div class="controls">
          <div class="column">
            <button id="upTen">
              <span class="label">↑↑</span>
              +10
            </button>
            <button id="downTen">
              <span class="label">↓↓</span>
              -10
            </button>
          </div>
          <div class="column">
            <button id="up">
              <span class="label">↑</span>
              +2
            </button>
            <button id="down">
              <span class="label">↓</span>
              -2
            </button>
          </div>
        </div>
      </div>
      
      <script>
        async function sendPower(){
          await fetch('/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'POWER' })
          });
        }

        async function sendUp(){
          await fetch('/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'VOLUP' })
          });
        }

        async function sendDown(){
          await fetch('/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'VOLDOWN' })
          });
        }

        async function sendUpTen(){
          await fetch('/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'VOLUPTEN' })
          });
        }

        async function sendDownTen(){
          await fetch('/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'VOLDOWNTEN' })
          });
        }
        
        document.getElementById('power').addEventListener('click', sendPower);
        document.getElementById('up').addEventListener('click', sendUp);
        document.getElementById('down').addEventListener('click', sendDown);
        document.getElementById('upTen').addEventListener('click', sendUpTen);
        document.getElementById('downTen').addEventListener('click', sendDownTen);
      </script>
    </body>
    </html>
  `);
});

const server = app.listen(9005, () => console.log(
    "\x1b[32m[ OK ]\x1b[0m Frontend initialized"
  ));

initWebSocketServer(server);