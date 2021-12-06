const {pool} = require('../database');
const commentsController = {};

// Get all comments for post with method get
commentsController.getComments = async(req,res)=>{
    const id = req.params.id;
    const comments = await pool.query('SELECT * FROM comments WHERE post_id = $1', [id]);
    if (comments.rows.length>0){
        activecomments = [];
        comments.rows.forEach((value) => {
            if (value.status == true){
                activecomments.push(value);
            }
        });
        res.json(activecomments)
      }else{
        res.json({Message: 'No comments found'})
    }
}

// Get one comment with method get
commentsController.getComment = async(req,res)=>{
    const id = req.params.id;
    const comment = await pool.query('SELECT * FROM comments WHERE comments_id = $1',[id]);

    console.log(comment);
      if (comment.rows.length == 0 || comment.rows[0].status == false ){
          res.json({
              code : 404,
              Message: "Comment not found"
          });
      }else{
          res.json(comment.rows);
    }

}

// Create new comment with POST method
commentsController.postComment = async (req, res) => {
    const newComment = {user_id,post_id,comment} = req.body;
    const addComment = await pool.query('INSERT INTO comments (user_id,post_id,comment,status) VALUES ($1,$2,$3,$4)',[newComment.user_id,newComment.post_id,newComment.comment,true]);
    res.json({
        Message: 'comment add successfully ',
        code: 200,
        data: newComment
    })

}


// Update one comment with method put
commentsController.putComment = async (req, res) =>{
    const id = req.params.id;
    const  {comment} = req.body;
    const response = await pool.query('UPDATE comments SET comment = $1 WHERE comments_id = $2', [comment,id]);
    console.log(response);
    res.json({
        Message: 'Comment updated successfully ',
        code: 200,
        CommentUpdated : {
            comment: comment
        }
    })

}


// Delete one comment with method put
commentsController.deleteComment = async (req, res) =>{
    const id = req.params.id;
    const response = await pool.query('UPDATE comments SET status = $1 WHERE comments_id = $2', [false, id]);
    console.log(response);
    res.json({
        Message: 'Comment deleted successfully ',
        code: 200,
        CommentId : id
    })

}

module.exports = commentsController;