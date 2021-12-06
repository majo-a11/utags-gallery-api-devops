const {pool} = require('../database');
const favoritesController = {};


// Get all tags by user with method get
favoritesController.getFavorites = async (req, res) => {
    const id = req.params.id;
    const fav = await pool.query('SELECT favorites.favorite_id,users.user_id,posts.post_id,posts.image_url,favorites.status,posts.title,posts.content,posts.views, posts.likes FROM favorites INNER JOIN users ON users.user_id = favorites.user_id INNER JOIN posts ON posts.post_id = favorites.post_id WHERE users.user_id = $1',[id]);
    if (fav.rows.length>0){
        activefavs = [];
        fav.rows.forEach((value) => {
            if (value.status == true){
                activefavs.push(value);
            }
        });
        res.json(activefavs);
      }else{
        res.json({Message: 'No favs found'});
    }
}

// Mark as favorite one post whith medthod POST and select, update database
favoritesController.MarkFavorite = async (req, res) => {
    const record = {user_id,post_id} = req.body;
    const queryfavorite = await pool.query('SELECT * FROM favorites WHERE user_id = $1 AND post_id = $2', [record.user_id, record.post_id]);
    if (queryfavorite.rowCount>0 && queryfavorite.rows[0].status == false){
        
        // update post to favorites
        pool.query('UPDATE favorites SET status = $1 WHERE favorite_id = $2', [true,queryfavorite.rows[0].favorite_id]);
        res.json({
            Message: 'post added again to favorite successfully ',
            code: 200,
            data: record
        });
    }else{
      
        // insert post to favorites
        pool.query('INSERT INTO favorites (user_id,post_id,status) VALUES ($1,$2,$3)',[record.user_id, record.post_id,true]);
        res.json({
            Message: 'post added to favorite successfully ',
            code: 200,
            data: record
        });
    }
}


// unmark one post as favorites with method put
favoritesController.UnMarkFavorite = async (req, res) =>{
    const id = req.params.id;
    const response = await pool.query('UPDATE favorites SET status = $1 WHERE favorite_id = $2', [false, id ]);
    console.log(response);
    res.json({
        Message: 'umark favorite post successfully ',
        code: 200,
        TagId : id
    })

}



module.exports = favoritesController;