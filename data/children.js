/*
This is the file that includes all of the functions that can manipulate children collection.
*/
const mongoCollections = require("./collection");
const  children = mongoCollections.children;
const users = mongoCollections.users;
const geofences = mongoCollections.geofences
const { ObjectId } = require('mongodb');


module.exports ={
    //Adds a child to children Collection in MongoDB
    async addChild(parentId, firstN, lastN, childPhoneNumber){
        if ((!parentId) || (typeof parentId !== "string")){
            throw `Error: ${parentId} is invalid`;
        }
        if ((!firstN) || (typeof firstN !== "string")){
            throw `Error: ${firstN} is invalid`;
        }
        if ((!lastN) || (typeof lastN !== "string")){
            throw `Error: ${lastN} is invalid`;
        }
        if ((!childPhoneNumber) || (typeof childPhoneNumber !== "string")){
            throw `Error: ${childPhoneNumber} is invalid`;
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

    async getMyChildren(id){
        //given id, return the user from the database
        if(!id){
            throw "Error: no id was provided";
        }
        var targetID = id.toString();
        const child = await children();
        const myChildren = await child.find({parentId : targetID}).toArray();
        return myChildren;
    },
   
    async get(id){
        if (!id && typeof id !== "string") throw "You must provide an id to search for";
            try{
               parseID = ObjectId(id)
            }catch(e){
              throw "Not Object ID"
            }
            const childrenCollection = await children();
        
            const child = await childrenCollection.findOne(parseID);
            if (child === null) throw "No user with that id";
           
        return child;
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

    //add geofence to child's geofences array
    async addGeofenceToChild(geofencesName, childsPhoneNumber) {
        childCollection = await children()
        childFound = await childCollection.findOne({childPhoneNumber:childsPhoneNumber}, { projection: { _id: 1 } })
        let childId = childFound._id
        geofenceCollection = await geofences()
        geofenceFound = await geofenceCollection.findOne({geofenceName: geofencesName})
        let geofencesId = geofenceFound._id
        let geofencingName = geofenceFound.geofenceName
        let geofenceAddress = geofenceFound.formattedAddress
        let foundLat = geofenceFound.lat
        let foundLng = geofenceFound.lng
        let foundRadius = geofenceFound.radius
        
        return this.get(childId).then(currentUser => {
          return childCollection.updateOne(
            { _id: childId },
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
      },


    //Updates children's lastKnownLat, lastKnownLng
    async updateChild(childId, lastKnownLat, lastKnownLng){
        if (!childId) throw "Invalid Input.";
        if (!lastKnownLat) throw "You must provide lattitude";
        if (!lastKnownLng) throw "You must provide longtitude";
        
        await this.get(childId)
        const childrenCollection = await children();
        const updatedChild = {
            lastKnownLat: lastKnownLat,
            lastKnownLng: lastKnownLng,
            lastUpdated: new Date()
        };
        
        const updatedInfo = await childrenCollection.updateOne({ _id: childId }, {$set:updatedChild});
       
        if (updatedInfo.modifiedCount === 0) {
            throw "could not update successfully";
        }
        return await this.get(childId);
        },

     //updating an existing child fcmToken
    async updateChildFCMToken(child_id, childToken){
        if (!child_id) throw "NO ID";
        if (!childToken) throw "NO TOKEN";
        const parsedId = ObjectId(child_id);
        const found_child = await this.get(parsedId) //possibly change this to children?
        const found_id = found_child._id
        
        const childrenCollection = await children();
        const updatedUser = {
        fcmToken: childToken
        };

        const updatedInfo = await childrenCollection.updateOne({_id: found_id}, {$set:updatedUser});
        if (updatedInfo.modifiedCount === 0) {
        throw "could not update successfully";
    }
        return await this.get(parsedId);
    },

    async addGeofenceAlerts(alertId, child_id, geofence_id, latitude, longtitude, accuracy, speed, altitude, bearing, timestamp){
        // convertedAlertId = ObjectId(alertId)
        childCollection = await children()
        const parsedChildId = ObjectId(child_id)
        childFound = await childCollection.findOne({_id:parsedChildId}, { projection: { _id: 1 } })
        let childId = childFound._id
        geofenceCollection = await geofences()
        const parsedGeofenceId = ObjectId(geofence_id)
        geofenceFound = await geofenceCollection.findOne({_id: parsedGeofenceId})
        let geofencesId = geofenceFound._id
        var geofencingName = geofenceFound.geofenceName   ///not working
        console.log(alertId)
        return this.get(childId).then(currentUser => {
        return childCollection.updateOne(
            { _id: childId },
            {
            $addToSet: {
                alerts: {
                _id: alertId,
                geofenceId: geofencesId,
                geofenceName: geofencingName,
                latitude: latitude,
                longtitude: longtitude,
                accuracy: accuracy,
                speed: speed,
                altitude: altitude,
                bearing: bearing,
                timestamp: timestamp,
                addedAt: new Date()
            }
        }
    });
});
},

    async returnLatestAlerts(parsedReceivedChildId){
        childrenCollection = await children()
        // const returnedAlertHistory = await childrenCollection.findOne( { "_id": parsedReceivedChildId }); //, { "alerts": {$slice: 5 } } );
        
        // var sortedarray = _.orderBy(returnedAlertHistory, ['alerts.timestamp'], ['desc'])
        // const returnedAlertHistory = await childrenCollection.find({ "_id": parsedReceivedChildId }).toArray();
        // var alertsArray = returnedAlertHistory.alerts
        // // // const { alerts } = returnedAlertHistory;
        // // console.log(returnedAlertHistory)
        const returnedAlertHistory = await childrenCollection.aggregate(
                { $match: {
                    _id : parsedReceivedChildId
                }},
                // Expand the scores array into a stream of documents
                { $unwind: '$alerts' },
                // Sort in descending order
                { $sort: {
                    'alerts.timestamp': -1
                }},
                ).toArray()
        var keyArray = returnedAlertHistory.map(function(item) { return item["alerts"]; });
        var mostRecentAlerts = keyArray.slice(Math.max(keyArray.length - 5, 0))  
        var reversedOrder = mostRecentAlerts.reverse() 
        return reversedOrder
    }
}