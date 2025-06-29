import { Client, Databases, Query, ID } from 'appwrite';
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject(PROJECT_ID);

const database = new Databases(client);
export const upgradeSearchCount = async (searchTerm, movie)=>{
    console.log(DATABASE_ID, COLLECTION_ID)
    try{
        const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm', searchTerm)]);
        if(response.documents.length > 0){
            const doc=response.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count : doc.count +1,
    })
}else{
    await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        id : movie.id,
        poster: `${movie.i.imageUrl}`,
    })
}
}catch(error){
    console.log(error);
}
}
export const getTrendingMovies = async ()=>{
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(5),
            Query.orderDesc('count'),

        ]);
        
        return result.documents;
    }catch(error){
        console.log(error);
    }
}
