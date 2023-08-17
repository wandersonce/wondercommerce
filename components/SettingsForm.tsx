"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useParams,useRouter } from "next/navigation";

import { Store } from "@prisma/client"
import Heading from "./ui/Heading";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { Separator } from "./ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "react-hot-toast";
import AlertModal from "./modals/AlertModal";

interface SettingFormProps{
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
})

type SettingsFormValues = z.infer<typeof formSchema>;

export default function SettingsForm({initialData} : SettingFormProps) {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);

      await axios.patch(`/api/stores/${params.storeId}`, data);

      router.refresh();

      toast.success("Store Updated.");
      
    } catch (error) {
      toast.error("Something went wrong.")
    } finally{
      setLoading(false);
    }
  };


  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/stores/${params.storeId}`);

      router.refresh();

      router.push("/");

      toast.success("Store Deleted");
      
    } catch (error) {
      toast.error("Make sure you removed all products and categories first.")
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
          title="Settings"
          description="Manage store preferences"
        />
        <Button
        disabled={loading}
        variant="destructive" 
        size="sm"
        onClick={() => setOpen(true)}
        >
          <Trash  className="h-4 w-4"/>
        </Button>
      </div>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField 
             control={form.control}
             name="name"
             render={({field}) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Store Name" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
             )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
    </>
  )
}
