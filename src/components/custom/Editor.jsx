import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { firebaseDb, GeminiAiLiveModel } from "../../../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import OutlineSection from "./OutlineSection";
import SlidesFrame from "./SlidesFrame";
import { Download, Loader2 } from "lucide-react";
import * as htmlToImage from 'html-to-image';

const Editor = () => {
  const { projectId } = useParams();
  const [projectDetails, setProjectDetails] = useState(null);
  const [outline, setOutline] = useState(null);
  const [slider, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSlidesGenerated, setIsSlidesGenerated] = useState(null);
  const [exportingPPT, setExportingPPT] = useState(false);
  const [slidesSaved, setSlidesSaved] = useState(false);
  const slidesContainerRef = useRef(null);

  const SLIDER_PROMPT = `Generate HTML (TailwindCSS + Flowbite UI + Lucide Icons) 
                    code for a 16:9 ppt slider in Modern Dark style.
                    {DESIGN_STYLE}. No responsive design; use a fixed 16:9 layout for slides.
                    Use Flowbite component structure. Use different layouts depending on content and style.
                    Use TailwindCSS colors like primary, accent, gradients, background, etc., and include colors from {COLORS_CODE}.
                    MetaData for Slider: {METADATA}

                    - Ensure images are optimized to fit within their container div and do not overflow.
                    - Use proper width/height constraints on images so they scale down if needed to remain inside the slide.
                    - Maintain 16:9 aspect ratio for all slides and all media.
                    - Use CSS classes like 'object-cover' or 'object-contain' for images to prevent stretching or overflow.
                    - Use grid or flex layouts to properly divide the slide so elements do not overlap.

                    Generate Image if needed using:
                    'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg'
                    Replace {imagePrompt} with relevant image prompt and altImageName with a random image name.  

                    <!-- Slide Content Wrapper (Fixed 16:9 Aspect Ratio) -->
                    <div class="w-[800px] h-[500px] relative overflow-hidden">
                    <!-- Slide content here -->
                    </div>
                    Also do not add any overlay : Avoid this :
                        <div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20"></div>

                    Just provide body content for 1 slider. Make sure all content, including images, stays within the main slide div and preserves the 16:9 ratio.`;

  const getProjectDetails = async () => {
    try {
      setLoading(true);
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
        }

        // Load existing slides if they exist
        if (data?.slides) {
          console.log("Loading existing slides:", data.slides);
          setSliders(data.slides);
          setSlidesSaved(true); // Mark slides as saved if they exist
        }

        // Generate outline only if it doesn't exist and we have project data
        if (!data?.outline) {
          console.log("No outline found - this shouldn't happen on editor page");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      getProjectDetails();
    }
  }, [projectId]);

  const GeminiSlideCall = async (prompt, index) => {
    try {
      const session = await GeminiAiLiveModel.connect();
      await session.send(prompt);

      let text = "";

      // Read stream
      for await (const message of session.receive()) {
        if (message.type === "serverContent") {
          const parts = message.modelTurn?.parts;
          if (parts && parts.length > 0) {
            text += parts?.map((p) => p.text).join("");

            const finalText = text
              .replace(/```html/g, "")
              .replace(/```/g, "")
              .trim();

            // Live update the slider
            setSliders((prev) => {
              const updated = prev ? [...prev] : [];
              updated[index] = { code: finalText };
              return updated;
            });
          }

          if (message.turnComplete) {
            console.log("✅ Slide", index + 1, "complete");
            break; // important: exit loop when done
          }
        }
      }

      session.close();
    } catch (err) {
      console.error("❌ Error generating slide", index + 1, err);
    }
  };

  const GenerateSlides = async () => {
    if (!projectDetails?.outline || projectDetails.outline.length === 0) return;

    console.log("🚀 Starting slide generation...");

    // Initialize sliders to empty states to show loaders (generate all slides, not limited to 5)
    setSliders(projectDetails.outline.map(() => ({ code: "" })));

    for (let index = 0; index < projectDetails.outline.length; index++) {
      const metaData = projectDetails.outline[index];
      const prompt = SLIDER_PROMPT
        .replace("{DESIGN_STYLE}", projectDetails?.designStyle?.designGuide ?? "")
        .replace("{COLORS_CODE}", JSON.stringify(projectDetails?.designStyle?.colors))
        .replace("{METADATA}", JSON.stringify(metaData));

      console.log("🧠 Generating slide", index + 1);
      await GeminiSlideCall(prompt, index); // wait for one slide to finish before next
      console.log("✅ Finished slide", index + 1);
    }

    console.log("🎉 All slides generated!");

    setIsSlidesGenerated(Date.now());
    
    toast.success("All Slides Generated!", {
      description: `Successfully created ${projectDetails.outline.length} slides. Saving to database...`,
      duration: 4000,
    });
  };

  useEffect(() => {
    if (projectDetails && !projectDetails?.slides?.length) {
      // if there are no slides yet
      GenerateSlides();
    }
  }, [projectDetails]);

  useEffect(() => {
    if (isSlidesGenerated && slider.length > 0) {
      SaveAllSlides();
    }
  }, [isSlidesGenerated]);

  const SaveAllSlides = async () => {
    try {
      await setDoc(
        doc(firebaseDb, "projects", projectId),
        {
          slides: slider,
        },
        { merge: true }
      );
      console.log("✅ Slides saved successfully to Firebase!");
      toast.success("Slides Saved!", {
        description: "Your presentation has been saved successfully.",
        duration: 3000,
      });
      setSlidesSaved(true); // Mark slides as saved
    } catch (error) {
      console.error("❌ Error saving slides:", error);
      toast.error("Failed to Save Slides", {
        description: "There was an error saving your slides. Please try again.",
        duration: 4000,
      });
    }
  };

  const ExportToPPT = async () => {
    if (!slidesContainerRef.current) return;
    
    setExportingPPT(true);
    
    try {
      // Import PptxGenJS dynamically
      const PptxGenJS = (await import('pptxgenjs')).default;
      const pptx = new PptxGenJS();

      // Set presentation properties
      pptx.author = 'SlideCraft AI';
      pptx.title = projectDetails?.userInputPrompt || 'Presentation';
      pptx.subject = 'AI Generated Presentation';

      // Get all iframes from the container
      const iframes = Array.from(slidesContainerRef.current.querySelectorAll("iframe"));

      console.log(`📸 Exporting ${iframes.length} slides in parallel...`);

      // Convert all slides to images in parallel for faster export
      const imagePromises = iframes.map(async (iframe, i) => {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (!iframeDoc) {
          console.warn(`Could not access iframe ${i + 1}`);
          return null;
        }

        // Grab the main slide element inside the iframe
        const slideNode = iframeDoc.querySelector("body > div") || iframeDoc.body;
        
        if (!slideNode) {
          console.warn(`No slide content found in iframe ${i + 1}`);
          return null;
        }

        try {
          // Optimized settings: quality 0.9 (faster, minimal quality loss), no cacheBust
          const dataUrl = await htmlToImage.toPng(slideNode, { 
            quality: 0.9,
            pixelRatio: 1,
            skipFonts: false,
            filter: (node) => {
              // Skip problematic external resources
              if (node.tagName === 'IMG') {
                const src = node.getAttribute('src');
                if (src && (src.startsWith('data:') || src.startsWith('http://localhost') || src.startsWith('https://ik.imagekit.io'))) {
                  return true;
                }
                if (src && (src.includes('flowbite.s3.amazonaws.com') || src.includes('cdnjs.cloudflare.com'))) {
                  return false;
                }
              }
              return true;
            }
          });
          
          console.log(`✅ Slide ${i + 1} converted`);
          return dataUrl;
        } catch (error) {
          console.error(`❌ Error converting slide ${i + 1}:`, error);
          return null;
        }
      });

      // Wait for all images to be generated
      const imageDataUrls = await Promise.all(imagePromises);

      // Add all slides to presentation
      imageDataUrls.forEach((dataUrl, i) => {
        if (dataUrl) {
          const slide = pptx.addSlide();
          slide.addImage({
            data: dataUrl,
            x: 0,
            y: 0,
            w: 10,
            h: 5.625, // 16:9 aspect ratio
          });
        }
      });

      // Save the presentation
      const fileName = `${projectDetails?.userInputPrompt?.substring(0, 30) || 'presentation'}_${Date.now()}.pptx`;
      await pptx.writeFile({ fileName });

      const successCount = imageDataUrls.filter(url => url !== null).length;
      toast.success("PPT Exported!", {
        description: `Successfully exported ${successCount} slides to PowerPoint.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("❌ Error exporting PPT:", error);
      toast.error("Failed to Export PPT", {
        description: "There was an error exporting your presentation. Please try again.",
        duration: 4000,
      });
    } finally {
      setExportingPPT(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-linear-to-r from-slate-800 via-primary to-slate-700 bg-clip-text text-transparent mb-2">
                Slide Editor
              </h1>
              <p className="text-slate-600">Edit and customize your presentation slides</p>
            </div>
            
            {/* Export Button - Only show when slides are saved */}
            {slidesSaved && slider.length > 0 && (
              <button
                onClick={ExportToPPT}
                disabled={exportingPPT}
                className="px-6 py-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:opacity-90 hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                style={{backgroundColor: "oklch(0.4585 0.2223 273.18 / 94.54%)"}}
              >
                {exportingPPT ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Export PPT</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Outline Section - Left Sidebar */}
          <div className="lg:col-span-4">
            <OutlineSection outline={outline} loading={loading} />
          </div>

          {/* Slides Editor - Right Content Area */}
          <div className="lg:col-span-8">
            <div className="space-y-6" ref={slidesContainerRef}>
              {slider && slider.length > 0 ? (
                slider.map((slide, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800">
                        Slide {index + 1}
                      </h3>
                      <span className="text-sm text-slate-500">
                        {outline?.[index]?.slidePoint || 'Untitled'}
                      </span>
                    </div>
                    {slide?.code ? (
                      <SlidesFrame 
                        slide={slide} 
                        colors={projectDetails?.designStyle?.colors} 
                        setUpdateSlider={(updatedCode) => {
                          const updated = [...slider];
                          updated[index] = { code: updatedCode };
                          setSliders(updated);
                          
                          // Save to Firebase after updating
                          setDoc(
                            doc(firebaseDb, "projects", projectId),
                            { slides: updated },
                            { merge: true }
                          ).then(() => {
                            console.log("✅ Slide", index + 1, "saved to Firebase");
                            toast.success("Slide Updated!", {
                              description: `Slide ${index + 1} has been saved successfully.`,
                              duration: 2000,
                            });
                          }).catch((error) => {
                            console.error("❌ Error saving slide:", error);
                            toast.error("Failed to Save", {
                              description: "There was an error saving your changes.",
                              duration: 3000,
                            });
                          });
                        }}
                      />
                    ) : (
                      <div className="w-full h-[500px] bg-slate-50 rounded-xl border-2 border-slate-200 flex items-center justify-center p-8">
                        <div className="w-full h-full grid grid-cols-2 gap-8">
                          {/* Text Loading Animation */}
                          <div className="flex flex-col justify-center space-y-4">
                            <div className="space-y-3">
                              <div className="h-8 bg-slate-200 rounded animate-pulse w-3/4"></div>
                              <div className="h-6 bg-slate-200 rounded animate-pulse w-full"></div>
                              <div className="h-6 bg-slate-200 rounded animate-pulse w-5/6"></div>
                              <div className="h-6 bg-slate-200 rounded animate-pulse w-4/5"></div>
                            </div>
                            <div className="flex items-center gap-2 text-primary mt-4">
                              <div className="flex gap-1">
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                              </div>
                            </div>
                          </div>

                          {/* Image Loading Animation */}
                          <div className="flex items-center justify-center">
                            <div className="w-64 h-64 bg-slate-200 rounded-lg flex flex-col items-center justify-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-primary mb-3"></div>
                              <p className="text-slate-500 text-sm">Loading image...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center">
                  <div className="text-slate-400 text-6xl mb-4">🎨</div>
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">
                    Generating Your Slides
                  </h3>
                  <p className="text-slate-500">
                    Please wait while we create your presentation...
                  </p>
                  <div className="inline-flex items-center gap-3 text-primary mt-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                    <span className="text-sm font-medium">Creating slides...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
