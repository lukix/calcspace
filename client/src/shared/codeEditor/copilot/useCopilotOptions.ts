import { useEffect, useState } from 'react';
import { Mode, MODES } from './constants';

export const useCopilotOptions = () => {
  const [copilotMode, setCopilotMode] = useState<Mode>(
    localStorage.getItem('copilotMode') as Mode || MODES.NONE
  );

  const [openAIApiKey, setOpenAIApiKey] = useState(
    localStorage.getItem('openAIApiKey') || ''
  );
  const [groqApiKey, setGroqApiKey] = useState(
    localStorage.getItem('groqApiKey') || ''
  );
  const [ollamaUrl, setOllamaUrl] = useState(
    localStorage.getItem('ollamaUrl') || ''
  );


  useEffect(() => {
      localStorage.setItem('copilotMode', copilotMode);
  }, [copilotMode]);

  useEffect(() => {
    localStorage.setItem('openAIApiKey', openAIApiKey);
  }, [openAIApiKey]);
  useEffect(() => {
    localStorage.setItem('groqApiKey', groqApiKey);
  }, [groqApiKey]);
  useEffect(() => {
    localStorage.setItem('ollamaUrl', ollamaUrl);
  }, [ollamaUrl]);

  return {
    copilotMode,
    setCopilotMode,
    openAIApiKey,
    setOpenAIApiKey,
    groqApiKey,
    setGroqApiKey,
    ollamaUrl,
    setOllamaUrl,
  };
}
