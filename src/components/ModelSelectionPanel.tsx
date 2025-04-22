import { ModelSelector } from "./ModelSelector";
import { DEFAULT_MODELS } from "../utils/Constants";

interface ModelSelectionPanelProps {
  llmModel: string;
  setLlmModel: (model: string) => void;
  isChangingLLMModel: boolean;
}

export function ModelSelectionPanel({
  llmModel,
  setLlmModel,
  isChangingLLMModel
}: ModelSelectionPanelProps) {
  return (
    <div className="w-full bg-[--bg-primary] p-5 rounded-lg shadow-md border border-[--border-color] mb-6">
      <h2 className="text-xl font-semibold mb-4 text-[--text-primary]">Model Selection</h2>
      <div className="w-full">
        <ModelSelector
          label="LLM Model"
          model={llmModel}
          onChange={setLlmModel}
          disabled={isChangingLLMModel}
        >
            {/* Group models by family */}
            {Object.entries(
              DEFAULT_MODELS.reduce((acc, model) => {
                const family = model.family;
                if (!acc[family]) {
                  acc[family] = [];
                }
                acc[family].push(model);
                return acc;
              }, {} as Record<string, typeof DEFAULT_MODELS>)
            ).map(([family, models]) => (
              <optgroup key={family} label={family}>
                {models.map((modelOption) => (
                  <option key={modelOption.name} value={modelOption.name}>
                    {modelOption.display_name}{" "}
                    {modelOption.size ? `(${modelOption.size})` : ""}
                    {modelOption.quantization
                      ? `- ${modelOption.quantization}`
                      : ""}
                  </option>
                ))}
              </optgroup>
            ))}
        </ModelSelector>
      </div>
    </div>
  );
}
