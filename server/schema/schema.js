const {projects, clients} = require('../sampleData.js')
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql')
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

// Mutations
const RootMutation = new GraphQLObjectType({
    name:'Mutation',
    fields: {
        addCliet: {
            type: ClientType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                phone: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args){
                const client = new Client({ //creating from mongoose query
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                })

                return client.save();
            }
        },
        // Delete Client
        deleteClient: {
            type: ClientType,
            args: {
                id: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                Project.find({clientId: args.id}).then((projects)=>{
                    projects.forEach(project=>project.remove())
                })
                return Client.findByIdAndRemove(args.id)
            }
        },
        addProject: {
            type: ProjectType,
            args: {
                name: {type:GraphQLNonNull(GraphQLString)},
                description: {type:GraphQLNonNull(GraphQLString)},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'new': {value: 'Not Started'},
                            'progress': {value: 'In Progress'},
                            'completed': {value: 'Completed'}
                        }
                    }),
                    defaultValue: 'Not Started'
                },
                clientId: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                const project = new Project({ //creating from mongoose query
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                })

                return project.save();
            }
        },
        deleteProject: {
            type: ProjectType,
            args: {
                id: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Project.findByIdAndRemove(args.id)
            }
        },
        updateProject: {
            type: ProjectType,
            args: {
                id: {type:GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLString }, 
                description: {type: GraphQLString }, 
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            'new': {value: 'Not Started'},
                            'progress': {value: 'In Progress'},
                            'completed': {value: 'Completed'}
                        }
                    })
                },
            },
            resolve(parent, args){
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            name:args.name,
                            description:args.description,
                            status:args.status,
                        }
                    },
                    {new: true}
                )
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})