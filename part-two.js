
const fs=require("node:fs");
const http = require("node:http");

const filePath = "./users.json";

const readUsers = () => {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
};

const writeUsers = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const server = http.createServer((req, res) => {

    if (req.method === "POST" && req.url === "/user") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            const users = readUsers();
            const { name, age, email } = JSON.parse(body);

            const exists = users.find(u => u.email === email);

            if (exists) {
                res.end(JSON.stringify({ message: "Email already exists." }));
                return;
            }

            const newUser = {
                id: users.length + 1,
                name,
                age,
                email
            };

            users.push(newUser);
            writeUsers(users);

            res.end(JSON.stringify({ message: "User added successfully." }));
        });
    }

    else if (req.method === "GET" && req.url === "/user") {
        const users = readUsers();
        res.end(JSON.stringify(users));
    }

    else if (req.method === "GET" && req.url.startsWith("/user/")) {
        const id = Number(req.url.split("/")[2]);
        const users = readUsers();

        const user = users.find(u => u.id === id);

        if (!user) {
            res.end(JSON.stringify({ message: "User not found." }));
            return;
        }

        res.end(JSON.stringify(user));
    }

    else if (req.method === "PATCH" && req.url.startsWith("/user/")) {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            const id = Number(req.url.split("/")[2]);
            const users = readUsers();

            const user = users.find(u => u.id === id);

            if (!user) {
                res.end(JSON.stringify({ message: "User ID not found." }));
                return;
            }

            Object.assign(user, JSON.parse(body));

            writeUsers(users);

            res.end(JSON.stringify({ message: "User updated successfully." }));
        });
    }

    else if (req.method === "DELETE" && req.url.startsWith("/user/")) {
        const id = Number(req.url.split("/")[2]);
        const users = readUsers();

        const index = users.findIndex(u => u.id === id);

        if (index === -1) {
            res.end(JSON.stringify({ message: "User ID not found." }));
            return;
        }

        users.splice(index, 1);
        writeUsers(users);

        res.end(JSON.stringify({ message: "User deleted successfully." }));
    }

    else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});



