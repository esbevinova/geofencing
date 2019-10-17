const mongoCollections = require("./collection");
const  users= mongoCollections.users;
const bcrypt = require("bcrypt");
const { ObjectId } = require('mongodb');
const children = mongoCollections.children;

module.exports ={
    /**
     * stores the signup information into a mongoDB
     * @param {*} username username they set 
     * @param {*} email validated email
     * @param {*} password password they set, 
     */
    async signup(username, email, password, firstName, lastName, phoneNumber){
        if ((!username) || (typeof username !== "string")){
            throw `Error: ${username} is invalid`;
        }
        if ((!password) || (typeof password !== "string")){
            throw `Error: ${password} is invalid`;
        }
        if ((!email) || (typeof email !== "string")){
            throw `Error: ${email}is invalid`;
        }
        if ((!firstName) || (typeof firstName !== "string")){
            throw `Error: ${firstName} is invalid`;
        }
        if ((!lastName) || (typeof lastName !== "string")){
            throw `Error: ${lastName} is invalid`;
        }
        if ((!phoneNumber) || (typeof phoneNumber !== "string")){
            throw `Error: ${phoneNumber} is invalid`;
        }
        const person = await users();
        let newPerson = {
            username,
            email,
            //this will bcrypt the password so it is harder to decrypt
            password: bcrypt.hashSync(password,1),
            firstName,
            lastName,
            phoneNumber,
            children: []
        };
        const insert = await person.insertOne(newPerson);
        if(insert.insertedCount === 0){
            throw "Could not add person";
        }
        const newId = insert.insertedId;
        return await this.get(newId);
    },

    /**
     *
     * @returns an array of all the people who signed up in the collection
     */
    async allPeople(){
        const people = await signup();
        return await people.find({}).toArray();
    },

    /**
     * get the person who signed up from the database
     * @param {string} id
     * @returns the person from the database
     */
    async get(id){
        //getting animal by id
       
            if (!id && typeof id !== "string") throw "You must provide an id to search for";
            try{
               parseID = ObjectId(id)
            }catch(e){
              throw "Not Object ID"
            }
            const userCollection = await users();
        
            const user = await userCollection.findOne(parseID);
            if (user === null) throw "No user with that id";
            
           const childrenCollection = await children();
          
           const child = await childrenCollection.find({ "userId": id}, { projection: { _id: 1, title: 1 } }).toArray();
        
        user.children = child;
        return user;
      },



    async getUserbyname(userName){
        if(!userName)
        {
            throw "User name not provided"
        }

        const person = await users();
        const findPerson = await person.findOne({username:userName});
        return findPerson;
    },

    async addChildToUser(id, childId, childFirstName, childLastName) {
        //adding a child to user
        console.log(id)
        console.log(childFirstName)
        let parsedId = ObjectId(id);
        const usersCollection = await users();
        return this.get(parsedId).then(currentUser => {
          return usersCollection.updateOne(
            { _id: parsedId },
            {
              $addToSet: {
                children: {
                  id: childId,
                  ChildFirstName: childFirstName,
                  childLastName: childLastName
                }
              }
            }
          );
        });
      },

    async updateUser(id, childId){
        //This function will update the name of an animal currently in the database.
        //If no id is provided, the method should throw.
        //If the animal cannot be updated (does not exist), the method should throw.
        //If the update succeeds, return the animal as it is after it is updated.
        
        if (!id) throw "You must provide an id to search for";
        if (!newName || typeof newName != "string") throw "Invalid Input.";
        
        await this.get(id)
        const userCollection = await users();
        const updatedUser = {
            children: childId
        };
        
        const updatedInfo = await userCollection.updateOne({ _id: id }, {$set:updatedUser});
        if (updatedInfo.modifiedCount === 0) {
            throw "could not update successfully";
        }
        return await this.get(id);
        
        }
}