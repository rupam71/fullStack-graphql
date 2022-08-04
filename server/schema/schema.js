const {projects, clients} = require('../sampleData.js')
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLList } = require('graphql')
const Project = require('../models/Project.js')
const Client = require('../models/Client.js')

//Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: ()=> ({
        id: {type:GraphQLID},
        name: {type:GraphQLString},
        email: {type:GraphQLString},
        phone: {type:GraphQLString},
    })
})

//Project Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: ()=> ({
        id: {type:GraphQLID},
        name: {type:GraphQLString},
        description: {type:GraphQLString},
        status: {type:GraphQLString},
        client: {
            type:ClientType,
            resolve(parent, args){
                // return clients.find(client=>client.id===parent.clientId); //From Local
                return Client.findById(parent.clientId); // From Mongoose
            }
        },
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                // return projects; //from local
                return Project.find(); // from mongoose
            }
        },
        project: {
            type: ProjectType,
            args: {id: {type:GraphQLID}}, // will send id from front end
            resolve(parent, args) {
                // mongoose function will write here here
                //  return projects.find(project => project.id === args.id) //from local
                return Project.findById(args.id) // from mongoose
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                // return clients; //from local
                return Client.find(); // from mongoose
            }
        },
        client: {
            type: ClientType,
            args: {id: {type:GraphQLID}}, // will send id from front end
            resolve(parent, args) {
                // mongoose function will write here here
                // return clients.find(client => client.id === args.id) //from local
                return Client.findById(args.id) // from mongoose
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
})