import fs from 'fs'
import path from 'path'
import getUser from "./utils/getUser"
const { ApolloServer } = require('apollo-server-express');
import resolvers from './resolvers/index'
// import typeDefs from './schema/typeDefs'
const typeDefs = fs
.readFileSync(path.join(__dirname, './schema/schema.graphql'),'utf8')
.toString()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({ req }) => {
        //Check token form header
        const token = req.headers.authorization || "" 
        //Extract user id from token
        const userId = getUser(token)
        
        return {userId}
        
    }
})


export default server
