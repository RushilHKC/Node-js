const express = require("express");
const path = require("path");
const app = express();
const userDB = require("./models/user");
const blogDB = require("./models/blog.js");
const commentDB = require("./models/comment.js")
const {connectDB} = require("./connection.js");
const userRoute = require("./routes/user.js");
const blogRouter = require("./routes/blog.js");
const {verifyToken} = require("./Auth/auth.js")
const parser = require('cookie-parser');
const { runInNewContext } = require("vm");
const {ApolloServer} = require('@apollo/server');
const typeDefs = require('./models/graphql.js');
const {expressMiddleware} = require('@apollo/server/express4');
const cors = require('cors');
const bodyParser = require('body-parser');
const { startStandaloneServer } = require("@apollo/server/standalone");
const {request,gql} = require('graphql-request');

const connectionString = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blogify";

try{
    connectDB(connectionString).then(()=> console.log("Database Connected Successfully"));
}
catch{
    console.log("database connection error");
}

app.use(parser());
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use("/user",userRoute);
app.use("/addBlog",verifyToken,blogRouter);

app.get("/", async(req,res)=>{
    bgs = await blogDB.find({});

    user_name = req.user?.name
    return res.render("home",{
        blogs:bgs,
        User:user_name
    });
});

app.get('/blog/:id',verifyToken,async (req,res)=>{
    
    // blog = await blogDB.findById(req.params.id);
    // comments = await commentDB.find({blogID : req.params.id}).populate('user');
    try {
        const query = gql `
            query getData($id:ID!){
                comments(id: $id){
                    text,
                    user{
                        fullName
                    }
                    createdAt
                }
                blog(id: $id){
                    image_url,
                    title,
                    content,
                    _id
                }
            }`;
        const data = await request('http://localhost:3000/graphql', query, {
            id: req.params.id
        });
        return res.render('blog',{
            blog: data.blog,
            comments:data.comments,
        });
    }
    catch(err){
        console.log(err);
    }

    
})

app.post('/blog/:id',verifyToken,async (req,res)=>{
    id = req.params.id
    const {comment} = req.body;
    await commentDB.create({
        user: req.user.id,
        blogID: id,
        text: comment,
    });

    res.redirect(`/blog/${id}#comments`)
})

const resolvers = {
    Query:{
        comments: async(_,args) => {
            return await commentDB.find({blogID: args.id}).populate('user')
        },
        users: async() => {
            return await userDB.find({});
        },
        blogs: async() => {  // Added this to match schema
            return await blogDB.find({}).populate('author');
        },
        blog: async(_,args) => {
            return blogDB.findById(args.id).populate('author');
        }
    },
    
    
}

async function startServer() {
    const server = new ApolloServer({
        typeDefs, // FIX: Correct spelling
        resolvers
    });

    await server.start();
    
    // server.applyMiddleware({ app });
    app.use(
            '/graphql',
            cors(),
            bodyParser.json(),
            expressMiddleware(server)
        );

    app.listen(3000,()=> console.log("Server Started"));
    // const {url} = await startStandaloneServer(server,{
    //     listen: {port:3000}
    // });    
}
startServer().catch(console.error);