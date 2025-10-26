import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { ArrowUp, Loader2Icon, PlusIcon } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { firebaseDb } from "../../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const PromptBox = forwardRef((props, ref) => {
    const [userInput , setUserInput] = useState("");
    const [slideCount, setSlideCount] = useState("4-6");
    const {user} = useUser();
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const textareaRef = useRef(null);

    // Expose focus method to parent component
    useImperativeHandle(ref, () => ({
        focus: () => {
            // Smooth scroll to the textarea first
            textareaRef.current?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
            
            // Delay focus slightly to allow scroll to complete for better UX
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 500);
        }
    }));

    const CreateAndSaveProject = async() => {
        // console.log("Creating new project with description:", userInput);
        // save project to db
        setLoading(true);
        const projectId = uuidv4();
        await setDoc(doc(firebaseDb,"projects",projectId),{
            projectId: projectId,
            userInputPrompt: userInput,
            slideCount: slideCount,
            createdBy:user?.primaryEmailAddress?.emailAddress || "",
            createdAt: new Date(),
        })
        setLoading(false);
        navigate(`/dashboard/projects/${projectId}/outline`);

    }

    const handleKeyPress = (e) => {
        // Check if Enter is pressed (without Shift) and input is not empty
        if (e.key === 'Enter' && !e.shiftKey && userInput.trim()) {
            e.preventDefault();
            CreateAndSaveProject();
        }
    }


  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center mt-21 space-y-4">
        <h2 className="font-bold text-4xl">
          Describe Your <span className="text-primary">Topic</span> We'll Design
          The Slides !
        </h2>
        <p className="mt-4 text-xl text-gray-500 text-center">
          Your Design will be saved as new project.
        </p>

        <div className="shadow-xl border-2 border-slate-200 hover:border-primary/30 transition-all duration-300 rounded-2xl overflow-hidden bg-white backdrop-blur-sm max-w-3xl w-full">
          <InputGroupTextarea 
            ref={textareaRef}
            placeholder="Enter your topic description here..." 
            className="min-h-36 text-lg p-6 border-0 focus:ring-0 resize-none placeholder:text-slate-400 bg-transparent w-full"
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="bg-slate-50/80 border-t-2 border-slate-200 p-4 flex justify-between items-center">
            {/* Left side - Number of slides selector */}
            <Select required onValueChange={setSlideCount} value={slideCount}>
              <SelectTrigger className="w-[200px] bg-white border-slate-300 hover:border-primary/50 transition-colors duration-200 rounded-xl shadow-sm">
                <SelectValue placeholder="No. Of Slides *" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectGroup>
                  <SelectItem value="4-6" className="hover:bg-primary/10 rounded-lg">4-6 slides</SelectItem>
                  <SelectItem value="6-8" className="hover:bg-primary/10 rounded-lg">6-8 slides</SelectItem>
                  <SelectItem value="8-10" className="hover:bg-primary/10 rounded-lg">8-10 slides</SelectItem>
                  <SelectItem value="10-12" className="hover:bg-primary/10 rounded-lg">10-12 slides</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            {/* Right side - Send button */}
            <InputGroupButton 
              variant="default" 
              className="bg-primary hover:bg-primary/90 text-white w-9 h-9 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              onClick={()=>CreateAndSaveProject()}
              disabled={!userInput.trim()}
            >
              {loading ?<Loader2Icon className="animate-spin"/> : <ArrowUp size={10} />}
            </InputGroupButton>
          </div>
        </div>
      </div>
    </div>
  );
});

PromptBox.displayName = 'PromptBox';

export default PromptBox;
