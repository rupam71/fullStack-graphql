import { gql, useQuery } from '@apollo/client';
import React from 'react';
import {GET_CLIENTS} from '../queries/clientsQuery';
import ClientRow from './ClientRow';
import Spinner from './spinner';

const Clients = () => {
    const {loading, error, data} = useQuery(GET_CLIENTS)
    
    if(loading) return <Spinner />
    if(error) return <p>Someting Went Wrong</p>
    
    return <>
        {!loading && !error && (
            <table className="table table-hover mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.clients.map(client=>{
                        return <ClientRow key={client.id} client={client} />
                    })}
                </tbody>
            </table>
        )}
    </>
}
 
export default Clients;