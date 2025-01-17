const http = require('http')
const express = require('express')
const { Server: SocketServer } = require('socket.io');
var os = require('os');
var pty = require('node-pty');
const fs = require('fs/promises')
const path = require('path')
const cors = require('cors');
const chokidar = require('chokidar')


var shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';

var ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: path.normalize(path.join(process.env.INIT_CWD, 'user')),
  env: process.env
});

const app = express();
const server = http.createServer(app);

const io = new SocketServer({
  cors: '*'
})

app.use(cors());

io.attach(server);

chokidar.watch(path.normalize('./user')).on('all', async (event, filePath) => {
  console.log(`Event detected: ${event}, Path: ${filePath}`);
  try {
    const updatedTree = await generateFileTree('./user');
    console.log("Emitting updated file tree:", updatedTree);
    io.emit('file:refresh', updatedTree);

  } catch (error) {
    console.error("Error generating file tree:", error);
  }
});





io.on('connection', (socket) => {
  console.log(`Socket connected`, socket.id)

  socket.on('file:change', async ({path, content}) => {
    await fs.writeFile(`./user${path}`, content)
  })

  socket.on('terminal:write', (data) => {
    ptyProcess.write(data);
  })
})

ptyProcess.onData(data => {
  io.emit('terminal:data', data)
})

// get request for getting the file tree
app.get('/files', async (req, res) => {
  const filTree = await generateFileTree('./user');
  return res.json({ tree: filTree })

})


// get request for content of the file
app.get('/files/content', async (req, res) => {
  const path = req.query.path;
  try {
    const content = await fs.readFile(`./user${path}`, "utf-8");

    console.log(content);
    return res.json({ content });

  } catch (error) {
    console.error("Error reading file content:", error);
    res.status(500).json({ error: "Failed to read file content" });
  }

})

server.listen(3000, () => console.log(`Docker Server running on port 3000`))

async function generateFileTree(dir) {
  const tree = {};

  async function buildTree(currDir, currTree) {
    const files = await fs.readdir(currDir);

    for (const file of files) {
      const filePath = path.join(currDir, file);
      const stat = await fs.stat(filePath);

      const fileNode = { id: filePath, name: file };

      if (stat.isDirectory()) {
        currTree[file] = {}
        await buildTree(filePath, currTree[file]);
      } else {
        currTree[file] = null;
      }
    }
  }

  await buildTree(dir, tree);
  return tree;
}
