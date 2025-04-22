import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { SendIcon } from "../assets/icons/SendIcon";
import { ResetIcon } from "../assets/icons/ResetIcon";
import { LoadingSpinner } from "../assets/icons/LoadingSpinner";
import { DEFAULT_MODELS } from "../utils/Constants";

interface LegalTextInputProps {
  onSubmit: (text: string) => Promise<void>;
  onReset: () => void;
  isLoading: boolean;
  isChangingModel: boolean;
  explanation: string;
  hasExplanation: boolean;
  llmModel: string;
  setLlmModel: (model: string) => void;
}

export function LegalTextInput({
  onSubmit,
  onReset,
  isLoading,
  isChangingModel,
  explanation,
  hasExplanation,
  llmModel,
  setLlmModel,
}: LegalTextInputProps) {
  const [legalText, setLegalText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (legalText.trim() && !isLoading && !isChangingModel) {
      await onSubmit(legalText);
    }
  };

  const handleReset = () => {
    setLegalText("");
    onReset();
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLlmModel(e.target.value);
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-[0_25px_80px_rgba(124,58,237,0.5)] border-2 border-[--color-accent-purple] mb-6 backdrop-blur-sm bg-white/90 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[--text-primary]">
          {hasExplanation || isLoading
            ? "Plain English Explanation"
            : "Paste Legal Text"}
        </h2>
        <div className="flex items-center gap-2">
          <label
            htmlFor="model-select"
            className="text-sm text-[--text-secondary]"
          >
            Model:
          </label>
          <select
            id="model-select"
            value={llmModel}
            onChange={handleModelChange}
            className="p-2 rounded-lg bg-[--bg-secondary] text-[--text-primary] border border-[--border-color] text-sm w-[400px]"
            disabled={isLoading || isChangingModel}
          >
            {DEFAULT_MODELS.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!hasExplanation && !isLoading ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={legalText}
            onChange={(e) => setLegalText(e.target.value)}
            placeholder="Paste legal text here to decode into plain English..."
            className="w-full h-80 p-4 rounded-lg bg-[--bg-secondary] text-[--text-primary] border-2 border-[--color-accent-purple-light] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)] shadow-inner transition-all"
            disabled={isLoading || isChangingModel}
            style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.05)" }}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[var(--color-accent-purple)] text-white hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              disabled={isLoading || isChangingModel || !legalText.trim()}
            >
              <SendIcon className="h-5 w-5" />
              Decode Legalese
            </button>
          </div>
        </form>
      ) : (
        <div
          className="bg-[--bg-secondary] p-4 rounded-lg border-2 border-[--color-accent-purple-light] min-h-[200px] max-h-[400px] overflow-y-auto shadow-inner"
          style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.05)" }}
        >
          {isLoading && !explanation ? (
            <div className="flex flex-col items-center justify-center h-40 gap-4">
              <LoadingSpinner className="h-8 w-8 text-[var(--color-accent-purple)] animate-spin" />
              <div className="text-[--text-secondary] italic">
                Decoding legalese to plain English...
              </div>
            </div>
          ) : (
            <div className="text-[--text-primary] markdown-content">
              <ReactMarkdown>{explanation}</ReactMarkdown>
              {isLoading && (
                <span className="inline-block ml-1 animate-pulse">▌</span>
              )}
            </div>
          )}
        </div>
      )}

      {(hasExplanation || isLoading) && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-lg bg-white text-[--color-accent-purple] border-2 border-[--color-accent-purple] hover:bg-[--bg-hover] transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            disabled={isLoading || isChangingModel}
          >
            <ResetIcon className="h-5 w-5" />
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
