/*
This is the file that includes all of the functions that can manipulate geofences collection.
*/
const mongoCollections = require("./collection");
const { ObjectId } = require('mongodb');
const  users= mongoCollections.users;
const children = mongoCollections.children;
const geofences = mongoCollections.geofences;


module.exports ={
    async addGeofence(parentId, geofenceName, formattedAddress, lat, lng, radius){
        if ((!parentId) || (typeof parentId !== "string")){
            throw `Error: ${userId} is invalid`;
        }
        if ((!geofenceName) || (typeof geofenceName !== "string")){
            throw `Error: ${geofenceName} is invalid`;
        }
        if ((!formattedAddress) || (typeof formattedAddress !== "string")){
            throw `Error: ${formattedAddress} is invalid`;
        }
        if (radius){
            intRadius = parseInt(radius)
        }
       
        const geofence = await geofences();
        let newGeofence = {
            parentId,
            geofenceName,
            formattedAddress,
            lat,
            lng,
            radius: intRadius,
            registeredChildren: [],
            CreatedAt: new Date()
        };
        const insert = await geofence.insertOne(newGeofence);
        if(insert.insertedCount === 0){
            throw "Could not add person";
        }
        const newId = insert.insertedId;
        return await this.get(newId);
    },

    /**
     *
     * @returns an array of all the geofences added to the collection
     */
    async allGeofences(){
        const geofences = await this.addGeofence();
        return await geofences.find({}).toArray();
    },

    /**
     * get the geofence from the database
     * @param {string} id
     * @returns the geofence from the database
     */
    async get(id){
        //given id, return the user from the database
        if(!id){
            throw "Error: no id was provided";
        }

        var targetID = ObjectId.createFromHexString(id.toString());
        const geofence = await geofences();
        const findGeofence = await geofence.findOne({_id: targetID});
        if(findGeofence === null){
            throw "No geofence was found with that id";
        }
        return findGeofence;
    },

    /**
     * get an already existing geofence from database by searching its name
     * @param {string} geofenceName
     * @returns the geofence from the database
     */
    async getGeofenceByName(geofenceName){
        if(!geofenceName)
        {
            throw "Geofence name not provided"
        }

        const geofence = await geofences();
        const findGeofence = await geofence.findOne({geofenceName:geofenceName});
        return findGeofence;
    },

    /**
     * add the child to geofences's array children in geofences collection
     * @param {string} geofencesName
     * @param {string} childsPhoneNumber
     * @returns the geofence with updated registeredChildren array
     */
    async addTheChildToGeofence(geofencesName, childsPhoneNumber) {
        //adding a child to geofence
        childCollection = await children()
        childFound = await childCollection.findOne({childPhoneNumber:childsPhoneNumber}, { projection: { _id: 1 } })
        let childId = childFound._id
        geofenceCollection = await geofences()
        geofenceFound = await geofenceCollection.findOne({geofenceName: geofencesName})
        let geofencesId = geofenceFound._id
        let parsedGeofencesId = ObjectId(geofencesId)
       
        return this.get(parsedGeofencesId).then(currentUser => {
          return geofenceCollection.updateOne(
            { _id: parsedGeofencesId },
            {
              $addToSet: {
                registeredChildren: {
                  childId: childId,
                  AddedAt: new Date()
                }
              }
            }
          );
        });
      }

}