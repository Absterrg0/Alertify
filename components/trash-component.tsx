    {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-200 mb-4">
                        Customize Your Message
                      </h3>
                      <div>
                        <Label htmlFor="title" className="text-sm font-medium text-gray-800 dark:text-zinc-200">
                          Title
                        </Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter notification title"
                          className="mt-2 w-full bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-sm font-medium text-gray-800 dark:text-zinc-200">
                          Content
                        </Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter notification message"
                          className="mt-2 w-full bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 h-28"
                        />
                      </div>
                      {isLogoChecked && (
  <div className="grid w-full items-center gap-3">
    <label className="text-sm font-medium text-gray-800 dark:text-zinc-200">
      Upload File{" "}
      [<span className="font-bold text-red-500">Same file must be present in your /public folder</span>]
    </label>

    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-lg border border-gray-200 dark:border-zinc-700 rounded-xl transition-all duration-300 p-4">
      <FileUpload
      isDark={isDark}
        onUploadComplete={(url, name) => {
          setUploadedFileUrl(url); // Updates file URL
          setFileName(name);       // Updates file name
        }}
        currentFile={uploadedFileUrl}
        uploadType="imageUploader"
      />
    </div>
  </div>
)}

                    </div>

                    <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-200 mb-4 flex justify-between items-center">
  <div>Color Configuration</div>
  <div className="flex items-center space-x-2">
    <Checkbox
      id="logo-toggle"
      checked={isLogoChecked}
      onCheckedChange={(checked) => setIsLogoChecked(checked as boolean)}
    />
    <Label htmlFor="logo-toggle" className="text-sm font-medium text-gray-800 dark:text-zinc-200 font-semibold">
      Use Logo Notification
    </Label>
  </div>
</h3>

                      {selectedStyle === "NATIVE" && (
                        <div className="flex justify-center">
                          <div className="w-full max-w-sm">
                            <ColorPicker onColorChange={setBackgroundColor} />
                          </div>
                        </div>
                      )}
                      {selectedStyle === "GRADIENT" && (
                        <>
                          <div className="flex justify-between mb-4">
                            <button
                              className={cn(
                                "py-2 px-4 rounded-lg transition-colors duration-300",
                                activeTab === "start"
                                  ? "bg-dark-gray-800 text-black shadow-lg"
                                  : "bg-white dark:bg-zinc-800 text-dark-gray-500 dark:text-dark-gray-400 border border-gray-200 dark:border-zinc-700",
                              )}
                              onClick={() => setActiveTab("start")}
                            >
                              Start Color
                            </button>
                            <button
                              className={cn(
                                "py-2 px-4 rounded-lg transition-colors duration-300",
                                activeTab === "end"
                                  ? "bg-dark-gray-800 text-black shadow-md"
                                  : "bg-white dark:bg-zinc-800 text-dark-gray-500 dark:text-dark-gray-400 border border-gray-200 dark:border-zinc-700",
                              )}
                              onClick={() => setActiveTab("end")}
                            >
                              End Color
                            </button>
                          </div>
                          <div className="flex justify-center mb-4">
                            <div className="w-full max-w-sm">
                              <ColorPicker onColorChange={activeTab === "start" ? setStartColor : setEndColor} />
                            </div>
                          </div>
                          <Select value={gradientDirection} onValueChange={setGradientDirection}>
                            <SelectTrigger className="w-full text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-zinc-200">
                              <SelectValue placeholder="Select gradient direction" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="to right">Horizontal</SelectItem>
                              <SelectItem value="to bottom">Vertical</SelectItem>
                              <SelectItem value="45deg">Diagonal ↘</SelectItem>
                              <SelectItem value="-45deg">Diagonal ↗</SelectItem>
                            </SelectContent>
                          </Select>
                        </>
                      )}
                    </div>
                  </div> */}

                  {/* Preview */}
                  {/* <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-200 mb-6">Preview</h3>
                    <div className="bg-gray-100 dark:bg-zinc-800 p-4 sm:p-6 rounded-lg shadow-sm overflow-x-auto">
                      {renderPreview()}
                    </div>
                  </div> */}

                  {/* Action Buttons */}
                  {/* <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 sm:justify-between sm:items-center p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-md">
  <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-4">
    <Button
      variant="outline"
      onClick={toggleTextColor}
      className="w-full sm:w-auto bg-slate-400 dark:bg-slate-800 text-white dark:text-white border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 active:bg-slate-200 dark:active:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      <span className="relative z-10">Text: {textColor}</span>
    </Button>

    <Button
      onClick={matchColor}
      className="w-full sm:w-auto bg-indigo-500 dark:bg-indigo-600 text-white rounded-md hover:bg-indigo-600 dark:hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:ring-offset-2 active:bg-indigo-700 dark:active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      Toggle Border
    </Button>
  </div>

  <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-4">
    <Button
      onClick={handleSendAlert}
      className="w-full sm:w-auto bg-teal-500 dark:bg-teal-600 text-white rounded-md hover:bg-teal-600 dark:hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:ring-offset-2 active:bg-teal-700 dark:active:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed group transition-all duration-200"
    >
      <span className="relative z-10">Send Alert</span>
    </Button>

    <Button
      onClick={handlePreview}
      className="w-full sm:w-auto bg-teal-500 dark:bg-teal-600 text-white rounded-md hover:bg-teal-600 dark:hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:ring-offset-2 active:bg-teal-700 dark:active:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed group transition-all duration-200"
    >
      <span className="relative z-10">Show Preview</span>
    </Button>
  </div>
</div> */}

















  // const renderPreview = () => {
  //   switch (selectedType) {
  //     case "ALERT":
  //       return (
  //         <MyAlert
  //           preview={true}
  //           title={title}
  //           description={description}
  //           backgroundColor={selectedStyle === "NATIVE" ? backgroundColor : gradientBackground}
  //           borderColor={matchBorderColor ? backgroundColor : "black"}
  //           textColor={textColor}
  //           onClose={() => {}}
  //           className="pointer-events-none border"
  //           uploadedFileUrl={uploadedFileUrl}
  //         />
  //       )
  //     case "ALERT_DIALOG":
  //       return (
  //         <div className="ml-56">
  //           <MyAlertDialog
  //             isOpen={false}
  //             onClose={() => {}}
  //             title={title}
  //             description={description}
  //             backgroundColor={selectedStyle === "NATIVE" ? backgroundColor : gradientBackground}
  //             textColor={textColor}
  //             borderColor={matchBorderColor ? backgroundColor : "black"}
  //             preview={true}
  //             className="pointer-events-none"
  //             uploadedFileUrl={uploadedFileUrl}
  //           />
  //         </div>
  //       )
  //     case "TOAST":
  //       return (
  //         <div className="pointer-events-none ml-60">
  //           <Toast
  //             isOpen={false}
  //             title={title}
  //             description={description}
  //             backgroundColor={selectedStyle === "NATIVE" ? backgroundColor : gradientBackground}
  //             textColor={textColor}
  //             borderColor={matchBorderColor ? backgroundColor : "black"}
  //             onClose={() => {}}
  //             preview={true}
  //             uploadedFileUrl={uploadedFileUrl}
  //             // logoOrientation={logoOrientation}
  //           />
  //         </div>
  //       )
  //   }
  // }











/*  const handlePreview = () => {
    setShowPreview(true)
  }*/
                





    // {showPreview && selectedType === "ALERT" && (
    //     <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
    //       <MyAlert
    //         preview={true}
    //         title={title}
    //         description={description}
    //         backgroundColor={selectedStyle === "NATIVE" ? backgroundColor : gradientBackground}
    //         borderColor={matchBorderColor ? backgroundColor : "black"}
    //         textColor={textColor}
    //         onClose={() => setShowPreview(false)}
    //         className="border-ocean-500 border shadow-lg animate-float"
    //         uploadedFileUrl={uploadedFileUrl}
    //       />
    //     </div>
    //   )}

    //   {showPreview && selectedType === "ALERT_DIALOG" && (
    //     <MyAlertDialog
    //       isOpen={true}
    //       onClose={() => setShowPreview(false)}
    //       title={title}
    //       description={description}
    //       backgroundColor={selectedStyle === "NATIVE" ? backgroundColor : gradientBackground}
    //       textColor={textColor}
    //       borderColor={matchBorderColor ? backgroundColor : "black"}
    //       preview={false}
    //       uploadedFileUrl={uploadedFileUrl}
    //     />
    //   )}

    //   {showPreview && selectedType === "TOAST" && (
    //     <Toast
    //       isOpen={true}
    //       title={title}
    //       description={description}
    //       backgroundColor={selectedStyle === "NATIVE" ? backgroundColor : gradientBackground}
    //       textColor={textColor}
    //       borderColor={matchBorderColor ? backgroundColor : "black"}
    //       onClose={() => setShowPreview(false)}
    //       preview={false}
    //       uploadedFileUrl={uploadedFileUrl}
    //     />
    //   )}




    // const handleSendAlert = async () => {
    //     try {
    //       if (selectedWebsites.length === 0) {
    //         toast({
    //           title: "Select at minimum 1 website",
    //           variant: "destructive",
    //         })
    //         return
    //       }
    //       for (const website of selectedWebsites) {
    //         if (website.status !== "ACTIVE") {
    //           toast({
    //             title: "Please verify the websites first",
    //             variant: "destructive",
    //           })
    //           return // Stop further execution if any website is not active
    //         }
    //       }
    //       const borderColor = matchBorderColor ? textColor : "black"
    
    //       // Send the POST request to send the alert
    //       const response = await axios.post("/api/notify", {
    //         payload: {
    //           title,
    //           description,
    //           selectedType,
    //           style: selectedStyle,
    //           backgroundColor: color,
    //           textColor,
    //           borderColor,
    //           fileName,
    //           uploadedFileUrl
              
              
    //         },
    //         websites: selectedWebsites,
    //       })
    
    //       // Check the response status
    //       if (response.status === 200) {
    //         console.log("Alert sent successfully")
    
    //         // Show success toast
    //         toast({
    //           title: "Notification has been sent successfully",
    //         })
    
    //         // Call getAlert to fetch the latest alerts
    //         await fetchAlerts()
    //       }
    //     } catch (error) {
    //       console.error("Error sending alert:", error)
    
    //       // Optional: Show error toast
    //       toast({
    //         title: "Failed to send the notification",
    //         variant: "destructive",
    //       })
    //     }
    //   }
    


    //   const toggleTextColor = () => {
    //     setTextColor((prevColor) => (prevColor === "black" ? "white" : "black"))
    //   }
    
    //   const matchColor = () => {
    //     setMatchBorderColor((prevState) => !prevState)
    //   }
    
    //   const gradientBackground = `linear-gradient(${gradientDirection}, ${startColor}, ${endColor})`
    
    //   const color = selectedStyle === "GRADIENT" ? gradientBackground : backgroundColor
    



    //   const [uploadedFileUrl,setUploadedFileUrl]=useState("")
    //   const [activeTab, setActiveTab] = useState("start")
    //     const [isLogoChecked, setIsLogoChecked] = useState(false)
    //     const [fileName, setFileName] = useState("")
    //     const [title, setTitle] = useState("Enter your title")
    //     const [startColor, setStartColor] = useState("#3B82F6")
    //     const [endColor, setEndColor] = useState("#2563EB")
    //     const [gradientDirection, setGradientDirection] = useState("to right")
    //     const [description, setDescription] = useState("Enter your description to display notification here!")
    //     const [backgroundColor, setBackgroundColor] = useState("#E0F2FE")
    //     const [showPreview, setShowPreview] = useState(false)
    //     const [textColor, setTextColor] = useState("black")
    //     const [matchBorderColor, setMatchBorderColor] = useState(false)