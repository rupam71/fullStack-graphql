import React from 'react';
import Clients from "./../components/clients";
import AddClientModal from "./../components/AddClientModal";
import Projects from "./../components/projects";
import AddProjectModal from '../components/AddProjectModal';

const Home = () => {
    return <>
        <div className="d-flex gap-3 mb-4">
            <AddClientModal />
            <AddProjectModal />
        </div>
        <Projects />
        <hr />
        <Clients />
    </>
}
 
export default Home;