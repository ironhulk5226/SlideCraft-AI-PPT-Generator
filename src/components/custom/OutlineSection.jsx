import React from "react";
import { useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit3, Sparkles } from "lucide-react";
import EditOutlineDialog from "./EditOutlineDialog";

const OutlineSection = ({ loading , outline , handleUpdateOutline, onGenerateOutline, generateSlideLoading = false }) => {
  const location = useLocation();
  const isEditorRoute = location.pathname.includes('/editor');
  
  return (
    <div className="w-full mt-8">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             Slides
            <span className="text-primary">Outline</span>
          </h2>
          <p className="text-sm text-slate-600 mt-1">Review your presentation structure</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 text-primary">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                  <span className="text-lg font-medium">Generating your slides outline...</span>
                </div>
              </div>
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && outline && outline.length > 0 && (
            <div className="space-y-4">
              {outline?.map((item, index) => (
                <div 
                  key={`${index}-${item.slideNo}-${item.slidePoint}`}
                  className="group bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-primary/30 rounded-xl p-5 transition-all duration-500 hover:shadow-md animate-in fade-in-0 slide-in-from-left-1"
                >
                  <div className="flex items-start gap-4">
                    {/* Slide Number Badge */}
                    <div className="shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-sm">
                      {typeof item.slideNo === 'string' ? item.slideNo.replace('Slide ', '') : item.slideNo || index + 1}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-primary transition-colors duration-200">
                        {item.slidePoint || 'Untitled Slide'}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {item.outline || 'No description available'}
                      </p>
                    </div>

                    {/* Edit Button - Only show on outline route */}
                    {!isEditorRoute && (
                      <EditOutlineDialog 
                        outlineData={item} 
                        onUpdate={(updatedData) => handleUpdateOutline(index, updatedData)}
                      >
                        <button className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer">
                          <Edit3 size={16} />
                        </button>
                      </EditOutlineDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && (!outline || outline.length === 0) && (
            <div className="text-center py-12">
              <div className="text-slate-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No outline generated yet</h3>
              <p className="text-slate-500">Your presentation outline will appear here once generated.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Generate Slides Button */}
      {outline && outline.length > 0 && !isEditorRoute && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <button 
          onClick={onGenerateOutline}
          disabled={generateSlideLoading}
          className="bg-primary hover:bg-primary/90 disabled:bg-slate-400 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:scale-100 transition-all duration-300 flex items-center gap-3 font-semibold">
            {generateSlideLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Slides
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default OutlineSection;
