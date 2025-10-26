import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowRight, FolderIcon, Calendar, FileText } from "lucide-react";
import { firebaseDb } from "../../../config/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";
import pdfIcon from '../../assets/sliderStyles/ppt.png'
import Loader from './Loader';

const MyProjects = ({ onCreateNewClick }) => {
  const [projects,setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user} = useUser();
  const navigate = useNavigate();

  useEffect(()=>{
    user && GetProjects();
  },[user])

  const GetProjects = async() => {
    setLoading(true);
    setProjects([]); // Reset projects before fetching
    
    const q = query(
      collection(firebaseDb, "projects"),
      where("createdBy", "==", user?.primaryEmailAddress?.emailAddress || "")
    );
    
    const querySnapShot = await getDocs(q);
    
    const projectsList = [];
    querySnapShot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
      projectsList.push({ id: doc.id, ...doc.data() });
    });
    
    setProjects(projectsList);
    setLoading(false);
  }


  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-bold text-4xl bg-black bg-clip-text text-transparent mb-2">
              My <span className="text-primary">Projects</span>
            </h2>
            <p className="text-slate-600">Manage and access your presentations</p>
          </div>
          <Button 
            onClick={onCreateNewClick}
            className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            style={{backgroundColor: "oklch(0.4585 0.2223 273.18 / 94.54%)"}}
          >
            + Create New Project
          </Button>
        </div>
        
        <div>
          {loading ? (
            <Loader message="Loading your projects..." />
          ) : !projects.length ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderIcon />
                </EmptyMedia>
                <EmptyTitle>No Projects Yet</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created any projects yet. Get started by creating
                  your first project.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex gap-2">
                  <Button onClick={onCreateNewClick} className="cursor-pointer hover:scale-105 transition-transform">Create Project</Button>
                </div>
              </EmptyContent>
              <Button
                variant="link"
                asChild
                className="text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                size="sm"
              >
                <a href="#" className="cursor-pointer">
                  Learn More <ArrowRight />
                </a>
              </Button>
            </Empty>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {projects.map((project, i) => (
                <div 
                  key={project.id || i}
                  className="group bg-white rounded-xl shadow-md border border-slate-200 p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  {/* Icon and Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-linear-to-br from-primary/10 to-primary/5 rounded-lg group-hover:scale-110 transition-transform">
                      <img src={pdfIcon} alt="PPT Icon" className="w-10 h-10" />
                    </div>
                    <div className="px-2 py-1 bg-slate-100 rounded-full">
                      <span className="text-xs font-semibold text-slate-700">
                        {project?.slides?.length || 0} Slides
                      </span>
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {project?.userInputPrompt || 'Untitled Project'}
                  </h3>

                  {/* Metadata */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs">
                        {project?.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    
                    {project?.designStyle?.name && (
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs capitalize">
                          {project?.designStyle?.name} Style
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <Button 
                      onClick={() => navigate(`/dashboard/projects/${project.id}/editor`)}
                      size="sm"
                      className="w-full text-xs cursor-pointer hover:scale-105 transition-all duration-300"
                      style={{backgroundColor: "oklch(0.4585 0.2223 273.18 / 94.54%)"}}
                    >
                      View Project
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
