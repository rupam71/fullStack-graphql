import { useQuery } from '@apollo/client';
import React from 'react';
import { GET_PROJECTS } from '../queries/projectQuery';
import ProjectCard from './ProjectCard';
import Spinner from './spinner';

const Projects = () => {
    const {loading, data, error} = useQuery(GET_PROJECTS)

    if(loading) return <Spinner />
    if(error) return <p>Something Went Wrong</p>

    return <>
        {data.projects.length>0 ? (
            <div className="row mt-4">
                {data.projects.map((project)=>{
                    return <ProjectCard key={project.id} project={project} />
                })}
            </div>
        ) : (
            <p>No Project</p>
        )}
        
    </>
}
 
export default Projects;