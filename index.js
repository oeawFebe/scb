const express=require('express')
const path=require('path')
const app=new express()
const bodyParser=require('body-parser')
const ejs=require('ejs');
const BlogPost=require('./models/BlogPost.js')
app.set('view engine','ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.listen(4000,()=>{
	console.log('App listening on port 4000')
});
app.get("/",async(req,res)=>{
	const blogposts=await BlogPost.find({})

	res.render('index',{
		blogposts
	});
});
app.get("/about",(req,res)=>{
	res.render('about');
});
app.get("/contact",(req,res)=>{
	res.render('contact');
});
app.get("/post/:id",async(req,res)=>{
	const blogpost=await BlogPost.findById(req.params.id)
	res.render('post',{
		blogpost
	});
});
app.get("/posts/new",(req,res)=>{
	res.render('create');
});
app.post("/posts/new",(req,res)=>{
	console.log(req.body);
	res.redirect("/");
});
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/my_database',{useNewUrlParser:true});
const fileUpload=require('express-fileupload')
app.use(fileUpload())
app.post('/posts/store',(req,res)=>{
	let image=req.files.image;
	image.mv(path.resolve(__dirname,'public/img',image.name),async(error)=>{
	await BlogPost.create({
		...req.body,
		image: '/img/'+image.name
	})
	res.redirect("/")
	})
})