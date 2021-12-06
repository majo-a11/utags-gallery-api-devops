const { response } = require('express');
const {pool} = require('../database');
const postController = {};
const fetch = require("node-fetch");

arr_images = []

// Get all posts with method get
postController.getPosts = async(req,res)=>{
    const post = await pool.query('SELECT * FROM posts ORDER BY post_id DESC');
    if (post.rows.length>0){
        activepost = [];
        post.rows.forEach((value) => {
            if (value.status == true){
                activepost.push(value);
            }
        });
        res.json(activepost)
      }else{
        res.json({Message: 'No posts found'})
      }

}


// Get all posts suscription with method get
postController.getPostsSuscription = async(req,res)=>{
    const user_id = req.params.user_id;
    const post = await pool.query('SELECT * FROM posts INNER JOIN channels ON posts.channel_id = channels.channel_id INNER JOIN users ON users.user_id = channels.user_id INNER JOIN suscriptions ON users.user_id = suscriptions.user_id WHERE suscriptions.user_id = $1 AND posts.status = true AND suscriptions.status = true',[user_id]);
    if (post.rows.length>0){
        activepost = [];
        post.rows.forEach((value) => {
            if (value.status == true){
                activepost.push(value);
            }
        });
        res.json(activepost)
      }else{
        res.json({Message: 'No posts found'})
      }

}


// Get one post with method get
postController.getPost = async(req,res)=>{
    const id = req.params.id;
    console.log(typeof id);
    if (id == 'undefined'){
        res.json({
            code : 403,
            Message: "Post not found"
        })
    
    }else{
        const query = await pool.query('SELECT * FROM posts WHERE post_id = $1',[id]) 
    
    if (query.rows.length == 0 || query.rows[0].status == false ){
        res.json({
            code : 404,
            Message: "Post not found"
        });
    }else{
        var viewsnumber = query.rows[0].views
        var newviewsnumber = runDecorator(viewsnumber)
        
        console.log(newviewsnumber);

        const response = pool.query('UPDATE posts SET views = $1 WHERE post_id = $2', [newviewsnumber,id]);
        console.log(response);

        query.rows[0].views = query.rows[0].views + 1
        res.json({
                Message: 'Post viewed successfully ',
                code: 200,
                data : [query.rows[0]]
            })

    }
    }
    

 

}

// Get imagesPost with method get
postController.getImagesPost = async(req,res)=>{
    const word = req.params.word;
    arr_images = []
    const base_url = 'https://pixabay.com/api/'
    const api_key =  '14007087-8bbeeb4a5a577e9c334006208' //process.env.API_KEY //22598012-ffd573dbbd295bea2b3baef64
    await fetch(base_url + "?key=" + api_key + "&q=" + word)
    .then(function(response) {
        console.log('response.body =', response.body);
        console.log('response.bodyUsed =', response.bodyUsed);
        console.log('response.headers =', response.headers);
        console.log('response.ok =', response.ok);
        console.log('response.status =', response.status);
        console.log('response.statusText =', response.statusText);
        console.log('response.type =', response.type);
        console.log('response.url =', response.url);
        return response.json();
     
    })
    .then(function(data) {
        console.log('data = ', data);
        arr = []
        arr = data.hits
        arr.forEach(logArrayElements);
        return this.arr_images

    })
    .catch(function(err) {
        console.error(err);
    });


res.json({images:arr_images})

}


// Create one post with method post
postController.postPost = async(req,res)=>{
    const newPost = {channel_id,title,content,image_url} = req.body;
    const postquantity = await pool.query('SELECT postquantity FROM channels WHERE channel_id = $1',[channel_id]);
    console.log(postquantity.rows[0].postquantity);
    var nepostquantity = postquantity.rows[0].postquantity;
    var newpostadded = runDecorator(nepostquantity);
    pool.query('UPDATE channels SET postquantity = $1 WHERE channel_id = $2',[newpostadded,newPost.channel_id]);
    const addPost = pool.query('INSERT INTO posts (channel_id,title,content,views,likes,status,image_url) VALUES ($1,$2,$3,$4,$5,$6,$7)',[newPost.channel_id,newPost.title,newPost.content,0,0,true,newPost.image_url]);
    res.json({
        Message: 'Post add successfully ',
        code: 200,
        data: newPost
    })

}


// Update one post with method put
postController.putPost = async (req, res) =>{
    const id = req.params.id;
    const  {title,content} = req.body;
    const response = await pool.query('UPDATE posts SET title = $1, content = $2 WHERE post_id = $3', [title,content,id]);
    console.log(response);
    res.json({
        Message: 'Post updated successfully ',
        code: 200,
        PostUpdated : {
            title: title,
            content: content
        }
    })

}

// use decorator pattern
let Like = function (number) {
    this.number = number;
    this.num = function () {
        return this.number;
    };
}

let DecoratedLike = function (number) {
   this.number = number + 1;
    this.numdecorator = function () {
        return this.number;
    };

}


function runDecorator(number) {
    let like = new Like(number);
    var valor = like.num();

    let decorated = new DecoratedLike(valor);
    return decorated.numdecorator();
}


// Update one post with like by method put
postController.putPostLike = async (req, res) =>{
    const id = req.params.id;
    await pool.query('SELECT likes FROM posts WHERE post_id = $1', [id], (err, like)=>{
        if (like.rows.length > 0){
            var likesnumber = like.rows[0].likes
            var newlikesnumber = runDecorator(likesnumber)
            console.log('***********************');
            console.log(newlikesnumber);

            const response = pool.query('UPDATE posts SET likes = $1 WHERE post_id = $2', [newlikesnumber,id]);
            console.log(response);
            res.json({
                    Message: 'Post liked successfully ',
                    code: 200,
                    PostUpdated : {
                        post_id: id,
                        likes: newlikesnumber
                    }
                })
        }else{
            res.json({Message: "Post not found", code:404})
        }
       


    });

}

// Delete one channel with method put
postController.deletePost = async (req, res) =>{
    const id = req.params.id;
    const response = await pool.query('UPDATE posts SET status = $1 WHERE post_id = $2', [false, id ]);
    console.log(response);
    res.json({
          Message: 'Post deleted successfully ',
        code: 200,
        PostId : id
    })

}

function logArrayElements(element, index) {
    if(index <6){
      arr_images.push(element.largeImageURL)
    }


}



module.exports = postController;