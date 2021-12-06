const {pool} = require('../database');
const tagsController = {};
// Get all tags by user with method get
tagsController.getTags = async (req, res) => {
    const id = req.params.id;
    const tags = await pool.query('SELECT * FROM tags WHERE user_id = $1',[id]);
    if (tags.rows.length>0){
        activetags = [];
        tags.rows.forEach((value) => {
            if (value.status == true){
                activetags.push(value);
            }
        });
        res.json(activetags);
      }else{
        res.json({Message: 'No tags found'});
    }
}
// get one and tag by user
tagsController.getTag = async(req,res)=>{
    const id = req.params.id;
    const tag = await pool.query('SELECT * FROM tags WHERE tag_id = $1',[id]);

    console.log(tag);
      if (tag.rows.length == 0 || tag.rows[0].status == false ){
          res.json({
              code : 404,
              Message: "Tag not found"
          });
      }else{
          res.json(tag.rows);
    }

}


// get tags by user and post
tagsController.getTagsPosts = async(req,res)=>{
    const user_id = req.params.user_id;
    const post_id = req.params.post_id;
    const tag = await pool.query('SELECT tags.tag_id,tags.name,tags.color,tags.status,posts.title,posts.content,posts.post_id FROM tags INNER JOIN posts_tags ON tags.tag_id = posts_tags.tag_id INNER JOIN posts ON posts.post_id = posts_tags.post_id WHERE tags.user_id = $1 AND posts.post_id = $2',[user_id, post_id]);

    console.log(tag);
      if (tag.rows.length == 0 || tag.rows[0].status == false ){
          res.json({
              code : 404,
              Message: "Tag not found"
          });
      }else{
          res.json(tag.rows);
    }

}


// Get posts by tag with method GET
tagsController.getTagDetails = async(req,res)=>{
    const id = req.params.id;
    const tag = await pool.query('SELECT tags.tag_id, tags.name, tags.color, posts.post_id,posts.image_url, posts.title, posts.content, posts.views, posts.likes FROM posts_tags INNER JOIN tags ON tags.tag_id = posts_tags.tag_id INNER JOIN posts ON posts.post_id = posts_tags.post_id WHERE tags.tag_id = $1',[id]);
    console.log(tag);
      if (tag.rows.length == 0 || tag.rows[0].status == false ){
          res.json({
              code : 404,
              Message: "Detail not found"
          });
      }else{
          res.json(tag.rows);
    }

}

// Create new tag with POST method
tagsController.postTag = async (req, res) => {
    const newTag = {user_id,name,color} = req.body;
    const addTag = await pool.query('INSERT INTO tags (user_id,name,color,status) VALUES ($1,$2,$3,$4)',[newTag.user_id,newTag.name,newTag.color,true]);
    res.json({
        Message: 'tag add successfully ',
        code: 200,
        data: newTag
    })

}

// Put tag to post
tagsController.insertTag = async (req, res) => {
    const Tag = {tag_id,post_id} = req.body;
    const addTag = await pool.query('INSERT INTO posts_tags (tag_id,post_id) VALUES ($1,$2)',[Tag.tag_id,Tag.post_id]);
    res.json({
        Message: 'tag added to post successfully ',
        code: 200,
        data: Tag
    })

}


// Update one chanell with method put
tagsController.putTag = async (req, res) =>{
    const id = req.params.id;
    const  {name,color} = req.body;
    const response = await pool.query('UPDATE tags SET name = $1, color = $2 WHERE tag_id = $3', [name,color,id]);
    console.log(response);
    res.json({
        Message: 'Tag updated successfully ',
        code: 200,
        TagUpdated : {
            name: name,
            color: color
        }
    })

}

// Delete one tag with method put
tagsController.deleteTag = async (req, res) =>{
    const id = req.params.id;
    const response = await pool.query('UPDATE tags SET status = $1 WHERE tag_id = $2', [false, id ]);
    console.log(response);
    res.json({
        Message: 'Tag deleted successfully ',
        code: 200,
        TagId : id
    })

}


// Delete one tag by post with method put
tagsController.deleteTagByPost = async (req, res) =>{
    const tag_id = req.params.tag_id;
    const post_id = req.params.post_id;
    const response = await pool.query('DELETE FROM posts_tags WHERE tag_id = $1 AND post_id = $2', [tag_id, post_id]);
    console.log(response);
    res.json({
        Message: 'Tag deleted successfully ',
        code: 200,
        TagId : tag_id
    })

}


module.exports = tagsController;
