'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ColorPicker } from '@/components/ui/color-picker';
import { Alert } from '@/components/presets/alerts/FirstAlert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AlertDemo() {
  const [showAlert, setShowAlert] = useState(false);
  const [startColor, setStartColor] = useState('#3B82F6');
  const [endColor, setEndColor] = useState('#2563EB');
  const [gradientDirection, setGradientDirection] = useState('to right');
  const [title, setTitle] = useState('Alert Title');
  const [description, setDescription] = useState('This is a description of the alert. It provides more context and information.');

  // Combine gradient properties into a single string
  const gradientBackground = `linear-gradient(${gradientDirection}, ${startColor}, ${endColor})`;

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-4">Alert Demo with Gradient</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Alert Content</h2>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter alert title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter alert description"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Gradient Settings</h2>
            
            <div>
              <Label>Start Color</Label>
              <ColorPicker onColorChange={setStartColor} />
            </div>
            
            <div>
              <Label>End Color</Label>
              <ColorPicker onColorChange={setEndColor} />
            </div>
            
            <div>
              <Label>Gradient Direction</Label>
              <Select 
                value={gradientDirection} 
                onValueChange={setGradientDirection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to right">Horizontal</SelectItem>
                  <SelectItem value="to bottom">Vertical</SelectItem>
                  <SelectItem value="45deg">Diagonal ↘</SelectItem>
                  <SelectItem value="-45deg">Diagonal ↗</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 p-4 rounded border">
              <Label>Preview</Label>
              <div 
                className="w-full h-16 rounded mt-2"
                style={{ background: gradientBackground }}
              />
            </div>
          </div>
        </div>
        
        <Button onClick={handleShowAlert} className="w-full">Show Alert</Button>
      </div>
      
      {showAlert && (
        <Alert
          textColor="black"
          borderColor="black"
          title={title}
          description={description}
          backgroundColor={gradientBackground}
          onClose={() => setShowAlert(false)}
          className="border-amber-900 border"
        />
      )}
    </div>
  );
}