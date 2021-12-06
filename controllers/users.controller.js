const {pool} = require('../database');
const bcrypt = require('bcrypt');
const saltRounds = 10; //put 12 in prod

const jwt = require('jsonwebtoken');
const Secret_Key = 'utags';

const userController = {};
// Get all users with method get
userController.getUsers = async(req,res)=>{
    const user = await pool.query('SELECT * FROM users');
    if (user.rows.length>0){
        activeusers = [];
        user.rows.forEach((value) => {
            if (value.status == true){
                activeusers.push(value);
            }
        });
        res.json(activeusers)
        //res.json(user.rows);
    }else{
        res.json({Message: 'No users found'})
    }
    
}
// Get one user with method get
userController.getUser = async(req,res)=>{
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    console.log(response);
    if (response.rows.length == 0 || response.rows[0].status == false ){
        res.json({
            code : 404,
            Message: "User not found"
        });
    }else{
        res.json(response.rows);
    }
    
}
// Get user profile with method get
userController.profile = async (req, res) =>{
    verifyToken(req, res);
    // res.send(req.userId)
    
    res.json({user_id: req.user_id})
}

// Login one user with method post
userController.login = async(req,res)=>{

    const login = {
        email: req.body.email,
        password: req.body.password
    }
    await pool.query('SELECT * FROM users WHERE email = $1 OR password = $2',[login.email, login.password], (err, user)=>{
        console.log(user);
        if (err) return res.status(400);
        if (user.rows.length == 0 || user.rows[0].status == false){
            res.json({
                Message: 'Something is wrong'
            })
        }else{
           
            // decrypt password
            const resultPassword = bcrypt.compareSync(login.password, user.rows[0].password);
            if(resultPassword){
                // Access Token expires in 1 hour
                const accessToken = jwt.sign({ id: user.rows[0].user_id}, Secret_Key, { expiresIn: '1h' })
                res.json({
                    Message: 'OK User was found',
                    code: 200,
                    usertype: user.rows[0].usertype,
                    name: user.rows[0].name,
                    lastname: user.rows[0].lastname,
                    email: user.rows[0].email,
                    password: user.rows[0].password,
                    status: user.rows[0].status,
                    token: accessToken
                });

            }else{
                res.json({
                    status: 'Fail User not found'
                });
            }
        }
    });
    
}
// Create one user with method post
userController.postUser = async(req,res)=>{
    const newUser = {name,lastname,email,password} = req.body;
    // create hash password
    const hash = bcrypt.hashSync(newUser.password, saltRounds);
    // end hash password

    // check email to determinate user rol
    let usertype = 0;
    let regex = new RegExp('^[_A-Za-z\\+]+(\.[_A-Za-z]+)*@utags.edu.mx$');
    // console.log(regex.test(newUser.email));
    if (regex.test(newUser.email) == true){
        usertype = 1
    }
    else{
        usertype = 2
    }
    const addUser = await pool.query('INSERT INTO users (usertype, name,lastname,email,password, status) VALUES ($1,$2,$3,$4,$5,$6)',[usertype,newUser.name,newUser.lastname,newUser.email,hash, true]);
    res.json({
        Message: 'User add successfully ',
        code: 200,
        data: newUser
    })
    
}

// Update one user with method put
userController.putUser = async (req, res) =>{
    const id = req.params.id;
    const { name, lastname, email} = req.body;
    const response = await pool.query('UPDATE users SET name = $1, lastname = $2, email = $3 WHERE user_id = $4', [name,lastname, email, id ]);
    console.log(response);
    res.json({
        Message: 'User updated successfully ',
        code: 200,
        UserUpdated : {
            name: name,
            lastname: lastname,
            email: email
        }
    })
    
}

// Delete one user with method put
userController.deleteUser = async (req, res) =>{
    const id = req.params.id;
    const { name, lastname, email} = req.body;
    const response = await pool.query('UPDATE users SET status = $1 WHERE user_id = $2', [false, id ]);
    console.log(response);
    res.json({
        Message: 'User deleted successfully ',
        code: 200,
        UserId : id
    })
    
}



function verifyToken (req, res , next){
    
    if(!req.headers.authorization){
        return res.status(401).send('Authorization: falied')
    }
   const token = req.headers.authorization.split(' ')[1]
    if (token === 'null'){
        return res.status(401).send('Authorization: falied')
    }
    
    const payload = jwt.verify(token, Secret_Key)
    console.log(req.headers.authorization);
    console.log(payload.id);
    req.user_id = payload.id;

    console.log(req.user_id);
}



module.exports = userController;