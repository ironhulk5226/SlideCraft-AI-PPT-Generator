import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { DialogClose } from '@radix-ui/react-dialog';

const EditOutlineDialog = ({children , outlineData,onUpdate}) => {
    const[localData , setLocalData] = React.useState(outlineData);
    const[openDialog , setOpenDialog] = React.useState(false);

    // Reset local data when dialog opens with new data
    React.useEffect(() => {
        if (openDialog && outlineData) {
            setLocalData(outlineData);
        }
    }, [openDialog, outlineData]);

    const handleChange = (field, value) => {
        setLocalData({
            ...localData,
            [field]: value
        })
    }

    const handleUpdate = () => {
        console.log("Updating outline with data:", localData); // Debug log
        if (onUpdate && typeof onUpdate === 'function') {
            onUpdate(localData);
            setOpenDialog(false);
        } else {
            console.error("onUpdate function not provided or not a function");
        }
    }


  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Slide Outline</DialogTitle>
          <DialogDescription>
            <div>
                <label htmlFor="">Slide Title</label>
                <input type="text" value={localData?.slidePoint} className="border border-slate-300 rounded-md p-2 mt-1 w-full"  onChange={(e)=>handleChange('slidePoint',e.target.value)}/>
                <label htmlFor="">Outline</label>
                <textarea value={localData?.outline} className="border border-slate-300 rounded-md p-2 mt-1 w-full h-32" onChange={(e)=>handleChange('outline',e.target.value)}/>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button onClick={handleUpdate}>Update</Button>
            <DialogClose>
                <Button variant="outline">Close</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditOutlineDialog