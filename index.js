var express = require("express");
var app = express();

const MongoClient = require('mongodb').MongoClient;

app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");


var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);
let url = 'mongodb://localhost/chatStorage';


var mangUsersOnline = [];

/*
MongoClient.connect(url, function(err, db) {
    if (err) {
        console.log('Error connecting to MongoDB');
        throw err;
    }

    const dbSocket = db.db('chatStorage');
    const onlineUsers = dbSocket.collection('onlineUsers');
    const historyMessages = dbSocket.collection('historyMessages');
});
*/

io.on("connection", function(socket) {
    console.log("Co nguoi vua ket noi, socket id: " + socket.id);

    socket.on("client_gui_username", function(data) {
        console.log("Co nguoi dang ki username la: " + data);

        if (mangUsersOnline.indexOf(data) >= 0) {
            socket.emit("server-send-dangki-thatbai", data);
        }
        else {
            mangUsersOnline.push(data);
            socket.Username = data;
            io.sockets.emit("server-send-dangki-thanhcong", {username: data, id:socket.id});
        }
    });

    socket.on("client_gui_message", function(data) {
        io.sockets.emit("server_gui_message", {Username: socket.Username, msg: data});
    })
});


app.get("/", function(req, res) {
    res.render("trangchu");
});
