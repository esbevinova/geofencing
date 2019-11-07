/*
This is the file that includes all of the functions that can manipulate children collection.
*/
const mongoCollections = require("./collection");
const { ObjectId } = require('mongodb');
const  children = mongoCollections.children;
const users = mongoCollections.users;
const geofences = mongoCollections.geofences


module.exports ={
    //Adds a child to children Collection in MongoDB
    async addChild(parentId, firstN, lastN, childPhoneNumber){
        if ((!parentId) || (typeof parentId !== "string")){
            throw `Error: ${userId} is invalid`;
        }
        if ((!firstN) || (typeof firstN !== "string")){
            throw `Error: ${firstN} is invalid`;
        }
        if ((!lastN) || (typeof lastN !== "string")){
            throw `Error: ${lastN} is invalid`;
        }
        if ((!childPhoneNumber) || (typeof childPhoneNumber !== "string")){
            throw 'Error: ${childPhoneNumber} is invalid';
        }
        
        const child = await children();
        let newChild = {
            parentId,
            firstN,
            lastN,
            childPhoneNumber,
            fcmToken: '',
            geofences: []
        };
        const insert = await child.insertOne(newChild);
        if(insert.insertedCount === 0){
            throw "Could not add child";
        }
        const newId = insert.insertedId;
        return await this.get(newId);
    },

    
    // /**
    //  * returns all existing children in children collection in an array format
    //  */
    // async allChildren(){
    //     const people = await signup();
    //     return await people.find({}).toArray();
    // },

    /**
     * get an already existing child from database by searching with Id
     * @returns the child from the database - object
     */
    async get(id){
        //given id, return the user from the database
        if(!id){
            throw "Error: no id was provided";
        }

        var targetID = ObjectId.createFromHexString(id.toString());
        const child = await children();
        //console.log(child)
        const findChild = await child.findOne({_id: targetID});
        if(findChild === null){
            throw "No child was found with that id";
        }
        return findChild;
    },

    /** 
     * @param {string} childPhoneNumber
     * @returns an object with child's information by searching for the provided phone number
     */
    async getChildbyPhoneNumber(childPhoneNumber){
        if(!childPhoneNumber)
        {
            throw "Phone number not provided"
        }
        const child = await children();
        const foundChild = await child.findOne({childPhoneNumber:childPhoneNumber});
        return foundChild;
    },

    /**
     * adds geofence to child under geofences array
     * @param {string} geofencesName 
     * @param {string} childsPhoneNumber 
     * @returns an updated child object
     */
    async addGeofenceToChild(geofencesName, childsPhoneNumber) {
        childCollection = await children()
        childFound = await childCollection.findOne({childPhoneNumber:childsPhoneNumber}, { projection: { _id: 1 } })
        let childId = childFound._id
        geofenceCollection = await geofences()
        geofenceFound = await geofenceCollection.findOne({geofenceName: geofencesName}, { projection: { _id: 1 } })
        let geofencesId = geofenceFound._id
        /*
        Decided to store only ID of geofence under child's geofences array
        let geofencingName = geofenceFound.geofenceName
        let geofenceAddress = geofenceFound.formattedAddress
        let foundLat = geofenceFound.lat
        let foundLng = geofenceFound.lng
        let foundRadius = geofenceFound.radius
        */
        
        return this.get(childId).then(currentUser => {
          return childCollection.updateOne(
            { _id: childId },
            {
              $addToSet: {
                geofences: {
                  geofenceId: geofencesId,
                //   geofenceName: geofencingName,
                //   formattedAddress: geofenceAddress,
                //   lat: foundLat, 
                //   lng: foundLng,
                //   radius: parseInt(foundRadius),
                  CreatedAt: new Date()
                }
              }
            }
          );
        });
      },


      //Updates children's lastKnownLat, lastKnownLng, fcmToken
    async updateChild(id, childId, lastKnownLat, lastKnownLng, fcmToken){
        if (!id) throw "You must provide an id to search for";
        if (!childId) throw "Invalid Input.";
        if (!lastKnownLat) throw "You must provide lattitude";
        if (!lastKnownLng) throw "You must provide longtitude";
        if (!fcmToken) throw "No token provided";
        
        await this.get(childId)
        const childrenCollection = await children();
        const updatedChild = {
            lastKnownLat: lastKnownLat,
            lastKnownLng: lastKnownLng,
            fcmToken: fcmToken,
            lastUpdated: new Date()
        };
        
        const updatedInfo = await childrenCollection.updateOne({ _id: id }, {$addToSet:updatedChild});
       
        if (updatedInfo.modifiedCount === 0) {
            throw "could not update successfully";
        }
        return await this.get(id);
        }
}