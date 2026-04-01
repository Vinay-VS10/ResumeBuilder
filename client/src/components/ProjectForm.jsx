import { Plus, Trash2 } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Sparkles ,Loader2} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../configs/api';

const ProjectForm = ({data,onChange}) => {
   const {token} = useSelector(state => state.auth)
   const [generatingIndex, setGeneratingIndex] = useState(-1);
   
    const generateProjectDescription = async (index) => {
  try {
    setGeneratingIndex(index);

    const project = data[index];

    const prompt = `
Enhance the following project description for a resume.

Return ONLY the improved paragraph. Do NOT include explanations.

Project Name: ${project.name}
Type: ${project.type}

Description:
${project.description}
`;

    const response = await api.post(
      '/api/ai/enhance-project-desc',
      { userContent: prompt },
      { headers: { Authorization: token } }
    );

    const updatedProjects = [...data];
    updatedProjects[index].description = response.data.enhancedContent;

    onChange(updatedProjects);

  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  } finally {
    setGeneratingIndex(-1);
  }
};

     const addProject = () => {
        const newProject = {
            name:"",
            type:"",
            description:"",
        };
        onChange([...data,newProject])
      }

    const removeProject = (index)=>{
        const updated = data.filter((_, i)=> i != index);
        onChange(updated)
    }

    const updateProject = (index,field,value)=>{
        const updated = [...data];
        updated[index] = {...updated[index],[field]:value}
        onChange(updated)
    }
  return (
  <div>
        <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Projects</h3>
            <p className='text-sm text-gray-500'>Add your Projects</p>
        </div>
        <button onClick={addProject}
        className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100
        text-green-700 rounded-lg hover:bg-green-200 transition-colors '>
            <Plus className='size-4' />
            Add Project
        </button>
        </div>

        
            
         
            <div className='space-y-4 mt-6'>
                {data.map((project,index)=>(
                    <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
                        <div className='flex justify-between items-start'>
                            <h4>Project #{index+1}</h4>
                            <button onClick={()=>removeProject(index)}
                             className='text-red-500 hover:text-red-700 transition-colors'>
                                <Trash2 className='size-4' />
                            </button>
                        </div>
                         
                          
                        <div className='grid  gap-3'>
                            <input  value={project.name || ""} onChange={(e)=>updateProject(index,"name",e.target.value)}
                             type="text" placeholder='Project Name'
                            className='px-3 py-2 text-sm rounded-lg ' />

                            <input  value={project.type || ""} onChange={(e)=>updateProject(index,"type",e.target.value)}
                             type="text" placeholder='Project Type'
                            className='px-3 py-2 text-sm rounded-lg ' />
                            

                             <button
      onClick={() => generateProjectDescription(index)}
      disabled={
        generatingIndex === index ||
        !project.name ||
        !project.description
      }
      className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100
      text-purple-900 rounded hover:bg-purple-300 transition-colors disabled:opacity-50"
    >
      {generatingIndex === index ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Sparkles className="w-3 h-3" />
      )}
      Enhance with AI
    </button>

                             
                            <textarea rows={4} value={project.description || ""} onChange={(e)=>updateProject(index,"description",e.target.value)}
                              placeholder='Describe your project'
                            className='w-full px-3 py-2 text-sm rounded-lg resize-none ' />

                           
                        </div>
                       
                

          
                         
                    </div>
                ))}
            </div>
        
    </div>
  )
}

export default ProjectForm
