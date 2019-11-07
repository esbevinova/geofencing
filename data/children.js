const mongoCollections = require("./collection");
const { ObjectId } = require('mongodb');
const  children = mongoCollections.children;
const users = mongoCollections.users;
const geofences = mongoCollections.geofences


module.exports ={
    
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
            geofences: []
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
        //console.log(child)
        const findChild = await child.findOne({_id: targetID});
        if(findChild === null){
            throw "No child was found with that id";
        }
        return findChild;
    },

    async getChildbyPhoneNumber(childPhoneNumber){
        if(!childPhoneNumber)
        {
            throw "Phone number not provided"
        }

        const child = await children();
        const foundChild = await child.findOne({childPhoneNumber:childPhoneNumber});
        return foundChild;
    },

    async addGeofenceToChild(geofencesName, childsPhoneNumber) {
        //adding a geofence to child
        childCollection = await children()
        childFound = await childCollection.findOne({childPhoneNumber:childsPhoneNumber}, { projection: { _id: 1 } })
        let childId = childFound._id
        let parsedChildId = ObjectId(childId)
        geofenceCollection = await geofences()
        geofenceFound = await geofenceCollection.findOne({geofenceName: geofencesName})
        let geofencesId = geofenceFound._id
        console.log(geofencesId)
        //stringedGeofencesId = ObjectId(geofencesId).toString()
       
        //console.log(stringedGeofencesId)
        console.log("LOOK AT ME")
        //let parsedGeofencesId = ObjectId(geofencesId)
        //console.log(parsedGeofencesId)
        let geofencingName = geofenceFound.geofenceName
        let geofenceAddress = geofenceFound.formattedAddress
        let foundLat = geofenceFound.lat
        let foundLng = geofenceFound.lng
        let foundRadius = geofenceFound.radius
        
        return this.get(parsedChildId).then(currentUser => {
          return childCollection.updateOne(
            { _id: parsedChildId },
            {
              $addToSet: {
                geofences: {
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