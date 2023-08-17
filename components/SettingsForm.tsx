"use client"

import { Store } from "@prisma/client"
import Heading from "./ui/Heading";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { Separator } from "./ui/separator";

interface SettingFormProps{
  initialData: Store;
}

export default function SettingsForm({initialData} : SettingFormProps) {
  return (
    <>
      <div className="flex items-center justify-center">
        <Heading
          title="Settings"
          description="Manage store preferences"
        />
        <Button
        variant="destructive" 
        size="sm"
        onClick={() => {}}
        >
          <Trash  className="h-4 w-4"/>
        </Button>
      </div>
      <Separator />
    </>
  )
}
