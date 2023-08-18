"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useParams,useRouter } from "next/navigation";

import { Billboard, Store } from "@prisma/client"


import { Trash } from "lucide-react";



import { toast } from "react-hot-toast";

import { useOrigin } from "@/hooks/use-origin";
import AlertModal from "@/components/modals/AlertModal";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ApiAlert from "@/components/ui/ApiAlert";
import ImageUpload from "@/components/ui/ImageUpload";

interface BillboardFormProps{
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
})

type SettingsFormValues = z.infer<typeof formSchema>;

export default function BillboardForm({initialData} : BillboardFormProps) {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit a Billboard" : "Add a Billboard";
  const toastMessage = initialData ? "Billboard Updated" : "Billboard Created.";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {label:"", imageUrl: ""},
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      if(initialData){
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
      }else{
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/billboards`)
      toast.success(toastMessage);
      
    } catch (error) {
      toast.error("Something went wrong.")
    } finally{
      setLoading(false);
    }
  };


  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);

      router.refresh();

      router.push("/");

      toast.success("Billboard Deleted");
      
    } catch (error) {
      toast.error("Make sure you removed categories using this billboard first.")
    } finally{
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal 
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-center">
        <Heading
          title={title}
          description={description}
        />
        {initialData && (
        <Button
        disabled={loading}
        variant="destructive" 
        size="sm"
        onClick={() => setOpen(true)}
        >
          <Trash  className="h-4 w-4"/>
        </Button>
        )
        }
      </div>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField 
             control={form.control}
             name="imageUrl"
             render={({field}) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value ?  [field.value] : []} 
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
             )}
            />
          <div className="grid grid-cols-3 gap-8">
            <FormField 
             control={form.control}
             name="label"
             render={({field}) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Billboard Label" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
             )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  )
}
