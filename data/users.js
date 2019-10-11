const mongoCollections = require("./collection");
const  users= mongoCollections.users;
const bcrypt = require("bcrypt");
const { ObjectId } = require('mongodb');

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
            phoneNumber

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
        //given id, return the user from the database
        if(!id){
            throw "Error: no id was provided";
        }

        var targetID = ObjectId.createFromHexString(id.toString());
        const person = await users();
        const findPerson = await person.findOne({_id: targetID});
        if(findPerson === null){
            throw "No person with that id";
        }
        return findPerson;
    },



    async getUserbyname(userName){
        if(!userName)
        {
            throw "User name not provided"
        }

        const person = await users();
        const findPerson = await person.findOne({username:userName});
        return findPerson;
    }
}