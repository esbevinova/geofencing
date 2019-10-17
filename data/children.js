const mongoCollections = require("./collection");
const  children = mongoCollections.children;
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');


module.exports ={
    
    async addChild(userId, firstN, lastN){
        if ((!userId) || (typeof userId !== "string")){
            throw `Error: ${userId} is invalid`;
        }
        if ((!firstN) || (typeof firstN !== "string")){
            throw `Error: ${firstN} is invalid`;
        }
        if ((!lastN) || (typeof lastN !== "string")){
            throw `Error: ${password} is invalid`;
        }
        
        const child = await children();
        let newChild = {
            userId,
            firstN,
            lastN
        };
        const insert = await child.insertOne(newChild);
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
        const child = await children();
        console.log(child)
        const findChild = await child.findOne({_id: targetID});
        if(findChild === null){
            throw "No child was found with that id";
        }
        return findChild;
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