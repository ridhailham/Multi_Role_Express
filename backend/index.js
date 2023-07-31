const express = require("express")
const cors = require("cors")
const session = require("express-session")
const dotenv = require("dotenv")
const db = require("./config/Database.js")
const SequelizeStore = require("connect-session-sequelize")
const UserRoute =  require("./routes/UserRoute.js")
const ProductRoute = require("./routes/ProductRoute.js")
const AuthRoute = require("./routes/AuthRoute.js")

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    store: store,
    saveUninitialized: true
}))



// (async()=>{
//     await db.sync();
// })();

db.sync()
.then(() => {
    console.log("database connected");
}).catch(() => {
    console.log("database failed");
})


app.use(cors(
    {
    credentials: true,
    origin: 'http://localhost:3000'
}
));
app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute)


// store.sync();

app.listen(4000, ()=> {
    console.log('Server up and running...');
});
