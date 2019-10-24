const mongoCollections = require("./collection");
const  users= mongoCollections.users;
const children = mongoCollections.children;
const geofences = mongoCollections.geofences;
const { ObjectId } = require('mongodb');

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
       
        const geofence = await geofences();
        let newGeofence = {
            parentId,
            geofenceName,
            formattedAddress,
            lat,
            lng,
            radius,
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
        const geofence = await geofences();
        console.log(geofence)
        const findGeofence = await geofence.findOne({_id: targetID});
        if(findGeofence === null){
            throw "No geofence was found with that id";
        }
        return findGeofence;
    },



    async getGeofenceByName(geofenceName){
        if(!geofenceName)
        {
            throw "Geofence name not provided"
        }

        const geofence = await geofences();
        const findGeofence = await geofence.findOne({geofenceName:geofenceName});
        return findGeofence;
    }

}