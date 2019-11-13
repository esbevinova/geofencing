/*
This is the file that includes all of the functions that can manipulate users collection.
*/
const mongoCollections = require("./collection");
const  users= mongoCollections.users;
const bcrypt = require("bcrypt");
const { ObjectId } = require('mongodb');
const children = mongoCollections.children;
const geofences = mongoCollections.geofences;

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
            fcmToken: '',
            children: [],
            geofences: []
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
     * @returns an array of all the users in the collection
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
            if (!id && typeof id !== "string") throw "You must provide an id to search for";
            try{
               parseID = ObjectId(id)
            }catch(e){
              throw "Not Object ID"
            }
            const userCollection = await users();
        
            const user = await userCollection.findOne(parseID);
            if (user === null) throw "No user with that id";
           
        return user;
      },

    /**
     * finds user by its username
     * @param {string} userName 
     * @returns found user from database
     */
    async getUserbyname(userName){
        if(!userName)
        {
            throw "User name not provided"
        }

        const person = await users();
        const findPerson = await person.findOne({username:userName});
        return findPerson;
    },

    async getUserbyfirstName(personEmail){
      if(!personEmail)
      {
          throw "Email not provided"
      }

      const person = await users();
      const foundPerson = await person.findOne({email:personEmail}, { projection: { _id: 1 } });
      const foundPersonId = foundPerson._id
      stringedFoundPersonId = foundPersonId.toString()      
      return stringedFoundPersonId;
  },

    /**
     * adds child to user's children array
     * @param {objectId} id 
     * @param {objectId} childId 
     * @param {string} childFirstName 
     * @param {string} childLastName 
     * @param {string} childPhoneNumber 
     */
    async addChildToUser(id, childId, childFirstName, childLastName, childPhoneNumber) {
        let parsedId = ObjectId(id);
        const usersCollection = await users();
        return this.get(parsedId).then(currentUser => {
          return usersCollection.updateOne(
            { _id: parsedId },
            {
              $addToSet: {
                children: {
                  id: childId,
                  childFirstName: childFirstName,
                  childLastName: childLastName,
                  childPhoneNumber: childPhoneNumber
                }
              }
            }
          );
        });
      },

      /**
       * adds geofence to user's geofences array
       */
    async addGeofenceToUser(id, geofenceId, geofenceName, formattedAddress, lat, lng, radius) {
      let parsedId = ObjectId(id);
      const usersCollection = await users();
      return this.get(parsedId).then(currentUser => {
        return usersCollection.updateOne(
          { _id: parsedId },
          {
            $addToSet: {
              geofences: {
                geofenceId: geofenceId,
                geofenceName: geofenceName,
                formattedAddress: formattedAddress,
                lat: lat, 
                lng: lng,
                radius: parseInt(radius)
              }
            }
          }
        );
      });
    },

  //Updates user's children array in database
  async updateUser(id, childId){
      if (!id) throw "You must provide an id to search for";
      if (!childId) throw "Invalid Input.";
      
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
      },


//ITS NOT WORKING!!!!!!!!!!
  //updating an existing parent fcmToken
  // async updateParentFCMToken(parent_id, parentToken){
  //   if (!parent_id) throw "NO ID";
  //   if (!parentToken) throw "NO TOKEN";
  //   // const parsedId = ObjectId(parent_id);
  //   const found_parent = await this.get(parent_id)
  //   const found_id = found_parent._id
  //   //console.log(found_parent)
    
  //   const usersCollection = await users();
  //   const updatedUser = {
  //     fcmToken: parentToken
  //   };

  //   const updatedInfo = await usersCollection.updateOne({_id: found_id}, {$set:updatedUser});
  //   if (updatedInfo.modifiedCount === 0) {
  //     throw "could not update successfully";
  // }
  // return await this.get(parsedId);
  // },


    //add geofences to children
    async addGeofenceToChildArray(userId, geofencesName, childsPhoneNumber) {
      childCollection = await children()
      childFound = await childCollection.findOne({childPhoneNumber:childsPhoneNumber}, { projection: { _id: 1 } })
      let childId = childFound._id
      geofenceCollection = await geofences()
      geofenceFound = await geofenceCollection.findOne({geofenceName: geofencesName})
      let geofencesId = geofenceFound._id
      usersCollection = await users()
    
      let geofencingName = geofenceFound.geofenceName
      let geofenceAddress = geofenceFound.formattedAddress
      let foundLat = geofenceFound.lat
      let foundLng = geofenceFound.lng
      let foundRadius = geofenceFound.radius
      
      
      return this.get(userId).then(currentUser => {
        return usersCollection.updateOne(
          { 'children.id': childId },
            {
              $push: {
                'children.$.registeredGeofences': {
                  geofenceId: geofencesId,
                  geofenceName: geofencingName,
                  formattedAddress: geofenceAddress,
                  lat: foundLat, 
                  lng: foundLng,
                  radius: parseInt(foundRadius),
                  CreatedAt: new Date()
                }
              }
            }
            );
      });
    }
}