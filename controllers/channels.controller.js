const {pool} = require('../database');
const channelController = {};

// Get all channels with method get
channelController.getChannels = async(req,res)=>{
    const channel = await pool.query('SELECT * FROM channels');
    if (channel.rows.length>0){
        activechannel = [];
        channel.rows.forEach((value) => {
            if (value.status == true){
                activechannel.push(value);
            }
        });
        res.json(activechannel)
      }else{
        res.json({Message: 'No channels found'})
    }
}

// Get  channel by user with method get
channelController.getChannelByUser = async(req,res)=>{
    const user_id = req.params.id
    const channel = await pool.query('SELECT users.user_id,channels.channel_id,channels.name,channels.description,channels.postquantity,channels.status,channels.created_at,channels.updated_at FROM channels INNER JOIN users ON channels.user_id = users.user_id WHERE users.user_id = $1', [user_id]);
    if (channel.rows.length>0){
        activechannel = [];
        channel.rows.forEach((value) => {
            if (value.status == true){
                activechannel.push(value);
            }
        });
        res.json(activechannel)
      }else{
        res.json({Message: 'No channels found'})
    }
}

// Get posts by channels with method get
channelController.getPostsByChannel = async(req,res)=>{
    const channel_id = req.params.channel_id;
    const channel = await pool.query('SELECT posts.post_id,posts.channel_id,posts.title,posts.content,posts.views,posts.likes,posts.status,posts.image_url,posts.created_at,posts.updated_at FROM posts INNER JOIN channels ON posts.channel_id = channels.channel_id WHERE channels.channel_id = $1',[channel_id]);
    if (channel.rows.length>0){
        activechannel = [];
        channel.rows.forEach((value) => {
            if (value.status == true){
                activechannel.push(value);
            }
        });
        res.json(activechannel)
      }else{
        res.json({Message: 'No channels found'})
    }
}


// Get one channel with method get
channelController.getChannel = async(req,res)=>{
    const id = req.params.id;
    const channel = await pool.query('SELECT * FROM channels WHERE channel_id = $1',[id]);

    console.log(channel);
      if (channel.rows.length == 0 || channel.rows[0].status == false ){
          res.json({
              code : 404,
              Message: "Channel not found"
          });
      }else{
          res.json(channel.rows);
    }

}


// Create one chanell with method post
channelController.postChannel = async(req,res)=>{
    const newChannel = {user_id,name,description} = req.body;
    const querychannel = await pool.query('SELECT * FROM channels WHERE user_id = $1', [newChannel.user_id]);
    if (querychannel.rowCount>0){
        res.json({
            Message: 'Cannot create a new channel, your user has one channel now',
            code: 403
        });
    }else{
        const addChannel =  pool.query('INSERT INTO channels (user_id,name,description,postquantity,suscribers,status) VALUES ($1,$2,$3,$4,$5,$6)',[newChannel.user_id,newChannel.name,newChannel.description,0,0,true]);
        res.json({
            Message: 'Channel added successfully ',
            code: 200,
            data: newChannel
        });
        
    }

    

}

// Update one chanell with method put
channelController.putChannel = async (req, res) =>{
    const id = req.params.id;
    const  {name,description} = req.body;
    const response = await pool.query('UPDATE channels SET name = $1, description = $2 WHERE channel_id = $3', [name,description,id]);
    console.log(response);
    res.json({
        Message: 'Channel updated successfully ',
        code: 200,
        ChannelUpdated : {
            name: name,
            description: description
        }
    })

}

// Delete one channel with method put
channelController.deleteChannel = async (req, res) =>{
    const id = req.params.id;
    const response = await pool.query('UPDATE channels SET status = $1 WHERE channel_id = $2', [false, id ]);
    console.log(response);
    res.json({
          Message: 'Channel deleted successfully ',
        code: 200,
        ChannelId : id
    })

}

module.exports = channelController;
