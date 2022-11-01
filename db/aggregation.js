
// MongoDB aggregation to find most favorite teacher


const { MongoClient } = require('mongodb');
const DB = process.env.DATABASE;

async function main() {
    
    //const uri ="mongodb+srv://api:HelloWorld@clustDBer0.8w8aafb.mongodb.net/api_project?retryWrites=true&w=majority";
    
    const client = new MongoClient(DB);

    try {
        
         const result = await client.connect();
         let db= result.db("api_project");
        let collection = db.collection("users");
  
        const pipeline = [
            {
              '$group': {
                '_id': '$favorite_teacher', 
                'No_of_students_liked': {
                  '$sum': 1
                }
              }
            }, {
              '$sort': {
                'No_of_students_liked': -1
              }
            }
          ];
          let data = await collection.find({}).toArray();
          let x = await collection.aggregate(pipeline).toArray();
          
          console.log("#######################################################")
          console.log()
          
          for(let i =0; i<(x.length-1);i++){
            j = i+1
            if(x[j].No_of_students_liked ==  x[i].No_of_students_liked){
                console.log("Most favorite teacher : ",(x[0]._id))
                console.log("Number of students liked : ",x[0].No_of_students_liked)
                console.log("----------------------------------------------------------")
            }else{
                console.log("Most favorite teacher : ",(x[0]._id))
                console.log("Number of students liked : ",x[0].No_of_students_liked)
                break
            }

          }
          console.log()
          console.log("#######################################################")





        
    } finally {
        
        await client.close();
    }
}

const agg = main().catch(console.error);

module.exports = agg;

