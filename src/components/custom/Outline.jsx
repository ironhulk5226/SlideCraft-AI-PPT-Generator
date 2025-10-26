import { firebaseDb, GeminiAiModel } from "../../../config/FirebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SliderStyle from "./SliderStyle";
import OutlineSection from "./OutlineSection";
import Loader from "./Loader";
import { useAuth, useUser } from "@clerk/clerk-react";
import { UserDetailContext } from "../../../context/UserDetailContext";

const Outline = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [generateSlideLoading, setGenerateSlideLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const {user} = useUser();
  const {userDetail, setUserDetail} = useContext(UserDetailContext);
  const auth = useAuth();
  const hasPremiumAccess = auth?.has ? auth.has({plan:'unlimited'}) : false;

  const getProjectDetails = async () => {
    try {
      setPageLoading(true);
      const docRef = doc(firebaseDb, "projects", projectId || "");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Project data:", docSnap.data());
        const data = docSnap.data();
        console.log("userInputPrompt:", data.userInputPrompt); // Debug log
        console.log("slideCount:", data.slideCount); // Debug log
        setProjectDetails(data);
        
        // Load existing outline from database if it exists
        if (data?.outline) {
          console.log("Loading existing outline from database:", data.outline);
          setOutline(data.outline);
        }
        
        // Load existing design style from database if it exists
        if (data?.designStyle) {
          console.log("Loading existing design style:", data.designStyle);
          setSelectedStyle(data.designStyle);
        }
        
        // Generate outline only if it doesn't exist and we have project data
        if (!data?.outline) {
          GenerateSlidersOutline(data);
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      getProjectDetails();
    }
  }, [projectId]);

  const GenerateSlidersOutline = async (data = projectDetails) => {
    try {
      // Logic to generate sliders outline
      // Provide a prompt that contains text
      setLoading(true);
      
      console.log("Generating outline with data:", data); // Debug log
      
      const outlinePrompt = `
          Generate a PowerPoint slide outline for the topic "${data?.userInputPrompt}". Create ${data?.slideCount} slides in total. Each slide should include a topic name and a 2-line descriptive outline that clearly explains what content the slide will cover.
          Include the following structure:
          The first slide should be a Welcome screen.
          The second slide should be an Agenda screen.
          The final slide should be a Thank You screen.
          Return the response only in JSON format, following this schema:
          [
          {
          "slideNo": "",
          "slidePoint": "",
          "outline": ""
          }
          ]
      `;
      
      const prompt = outlinePrompt;

      // To generate text output, call generateContent with the text input
      const result = await GeminiAiModel.generateContent(prompt);

      const response = result.response;
      const text = response.text();
      console.log(text);
      
      const rawJson = text.replace('```json', '').replace('```', '').trim();
      const JSONData = JSON.parse(rawJson);
      setOutline(JSONData);
      setLoading(false);
    } catch (error) {
      console.error("Error generating outline:", error);
      setLoading(false);
    }
  };
    const handleUpdateOutline = (index, updatedData) => {
        console.log("Updating outline at index:", index, "with data:", updatedData); // Debug log
        setOutline((prevOutline) => 
            prevOutline.map((item,i) => 
               i == index ? { ...item, ...updatedData } : item  // as index is 0 based
            )
        );
    };

    const onGenerateOutline = async() => {
        // Check if user has premium access
        if (!hasPremiumAccess) {
            // Check if user has enough credits
            if (!userDetail || userDetail.credits <= 0) {
                console.error("Insufficient credits");
                toast.error("Insufficient Credits", {
                    description: "You don't have enough credits to generate slides. Please purchase more credits.",
                    duration: 4000,
                });
                // Redirect to pricing page
                setTimeout(() => {
                    navigate("/pricing");
                }, 2000);
                return;
            }
        }

        // Validate that a design style is selected
        if (!selectedStyle) {
            console.error("Please select a design style before generating slides");
            toast.error("Design Style Required", {
                description: "Please select a design style before generating slides.",
                duration: 4000,
            });
            return;
        }

        // Validate that outline exists
        if (!outline || outline.length === 0) {
            console.error("No outline data available");
            toast.error("No Outline Available", {
                description: "No outline data available. Please try again.",
                duration: 4000,
            });
            return;
        }

        setGenerateSlideLoading(true);
        try {
            // Update Firebase with designStyle and outline
            await updateDoc(doc(firebaseDb, 'projects', projectId || ""), {
                designStyle: selectedStyle,
                outline: outline
            });
            
            // Deduct credits only if user doesn't have premium access
            if (!hasPremiumAccess) {
                await updateDoc(doc(firebaseDb, "users", user?.primaryEmailAddress?.emailAddress || ""), {
                    credits: userDetail.credits - 1
                });
                
                // Update local context
                setUserDetail({
                    ...userDetail,
                    credits: userDetail.credits - 1
                });
            }
            
            console.log("Slides generated and saved successfully!");
            toast.success("Slides Configuration Saved!", {
                description: "Your presentation is ready to generate. Redirecting...",
                duration: 3000,
            });
            
            // Navigate to editor page after successful save
            setTimeout(() => {
                navigate(`/dashboard/projects/${projectId}/editor`);
            }, 1000);
        } catch (error) {
            console.error("Error generating slides:", error);
            toast.error("Failed to Save Configuration", {
                description: "Error saving slide configuration. Please try again.",
                duration: 4000,
            });
        } finally {
            setGenerateSlideLoading(false);
        }
    }

  

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 p-6">
      {pageLoading ? (
        <Loader fullScreen message="Loading project details..." />
      ) : projectDetails && (
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-linear-to-r from-slate-800 via-primary to-slate-700 bg-clip-text text-transparent mb-4">
              Settings & Slide Outline
            </h2>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500 font-medium">
                    Project Topic
                  </p>
                  <p className="text-slate-800 font-semibold">
                    {projectDetails.userInputPrompt}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500 font-medium">
                    Slide Count
                  </p>
                  <p className="text-primary font-semibold">
                    {projectDetails.slideCount} slides
                  </p>
                </div>
              </div>
            </div>
          </div>
          <SliderStyle selectStyle={(value)=>setSelectedStyle(value)} />
          <OutlineSection loading={loading} outline={outline} handleUpdateOutline={handleUpdateOutline} onGenerateOutline={onGenerateOutline} generateSlideLoading={generateSlideLoading} />
        </div>
      )}
    </div>
  );
};

export default Outline;
