import { gql } from "@apollo/client";

export const ADD_CLIENT = gql`
    mutation addCliet($name: String!, $email: String!, $phone: String!){
        addCliet(name: $name, email: $email, phone: $phone) {
            id
            name
            email
            phone
        }
    }
`

export const DELETE_CLIENT = gql`
    mutation deleteClient($id: ID!){
        deleteClient(id: $id) {
            id
            name
            email
            phone
        }
    }
`