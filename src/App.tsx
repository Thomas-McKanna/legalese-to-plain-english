import { useState } from "react";
import { ModelLoader } from "./components/ModelLoader";
import { useLLMEngine } from "./hooks/useLLMEngine";
import { useConversation } from "./hooks/useConversation";
import { GitHubIcon } from "./assets/icons/GitHubIcon";
import { StarburstIcon } from "./assets/icons/StarburstIcon";
import { LegalTextInput } from "./components/LegalTextInput";

function App() {
  const [llmModel, setLlmModel] = useState("Llama-3.1-8B-Instruct-q4f32_1-MLC");

  const { engine, loadingStatus, modelLoaded, isChangingModel } =
    useLLMEngine(llmModel);
  const {
    explanation,
    isLoading,
    hasExplanation,
    sendToLLM,
    resetConversation,
  } = useConversation(engine);

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto p-4 sm:p-6 flex flex-col items-center max-w-5xl min-w-[800px] lg:min-w-[1000px] xl:min-w-[1200px]">
        <div className="w-full flex flex-col justify-center items-center mb-8">
          <div className="flex items-center">
            <StarburstIcon className="h-16 w-16 mr-4" />
            <h1 className="text-5xl font-bold text-center text-white tracking-tight drop-shadow-lg">
              Legalese Decoder
            </h1>
          </div>
          <p className="text-white/90 text-sm mt-2 bg-black/20 px-3 py-1 rounded-full">
            100% browser-based • Your data never leaves your device
          </p>
        </div>

        <ModelLoader loadingStatus={loadingStatus} modelLoaded={modelLoaded} />

        {modelLoaded && (
          <div className="flex flex-col items-center w-full max-w-full">
            {/* Combined Legal Text Input and Explanation Output with Model Selection */}
            <LegalTextInput
              onSubmit={sendToLLM}
              onReset={resetConversation}
              isLoading={isLoading}
              isChangingModel={isChangingModel}
              explanation={explanation}
              hasExplanation={hasExplanation}
              llmModel={llmModel}
              setLlmModel={setLlmModel}
            />
          </div>
        )}
      </div>

      {/* GitHub Link */}
      <footer className="w-full py-4 mt-8 flex justify-center">
        <a
          href="https://github.com/Thomas-McKanna/legalese-to-plain-english"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white hover:text-white/80 transition-colors !text-white"
        >
          <GitHubIcon className="h-5 w-5" />
          <span>View on GitHub</span>
        </a>
      </footer>
    </div>
  );
}

export default App;
