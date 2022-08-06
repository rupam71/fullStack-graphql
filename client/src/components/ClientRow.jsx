import { useMutation } from '@apollo/client';
import React from 'react';
import {FaTrash} from 'react-icons/fa'
import { DELETE_CLIENT } from '../mutation/clientMutation';
import { GET_CLIENTS } from '../queries/clientsQuery';

const ClientRow = ({client}) => {
    const [deleteClient] = useMutation(DELETE_CLIENT,{
        variables: {id: client.id},
        // Update state immidiatly

        // technique 1 //after delete mutation we will call GET_CLIENTS to update.
        // refetchQueries: [{ query: GET_CLIENTS}] 

         //technique 2 //Most efficieant 
         // 1. first we will collect GET_CLIENTS data from cache which already store
         // 2. then we will update this via writeQuery call.
        update(cache, {data: {deleteClient}}) {
            const {clients} = cache.readQuery({
                query: GET_CLIENTS
            });
            cache.writeQuery({
                query: GET_CLIENTS, // write in GET_CLIENTS
                data: {clients:clients.filter(client=>client.id !== deleteClient.id)},
            })
            // To make this work, we need to write cache varible in app.js where
            // our apollo graphQL provider use. 
        }
    })
    return ( 
        <tr>
            <td>{client.name}</td>
            <td>{client.email}</td>
            <td>{client.phone}</td>
            <td>
                <button className="btn btn-danger btn-sm" onClick={deleteClient}>
                    <FaTrash />
                </button>
            </td>
        </tr>
     );
}
 
export default ClientRow;