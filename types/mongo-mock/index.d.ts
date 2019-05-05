declare module 'mongo-mock' {
    import { MongoClient } from 'mongodb'
    const content: {
        // just take the offical mongo client types, even though the mock is not supporting everything
        MongoClient: MongoClient
    }
    export default content
}
