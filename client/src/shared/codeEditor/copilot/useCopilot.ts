import { useEffect, useMemo } from 'react';
import axios from 'axios';
import pDebounce from 'p-debounce';

import { DEBOUNCE_WAIT, Mode, MODES, SYSTEM_PROMPT } from './constants';
import { useCache } from './useCache';

type CompletionRequestParams = {
  openAIApiKey: string,
  groqApiKey: string,
  ollamaUrl: string,
  mode: Mode,
}
const completionRequest = ({
  openAIApiKey,
  groqApiKey,
  ollamaUrl,
  mode,
}: CompletionRequestParams) => async (prompt: string) => {
  const { endpoint, body, headers, parseResponse } = (() => {
    const foundMode = {
      [MODES.OPENAI]: {
        endpoint: 'https://api.openai.com/v1/chat/completions',
        body: {
          model: 'gpt-3.5-turbo',
          'messages': [
            {
              'role': 'system',
              'content': SYSTEM_PROMPT,
            },
            {
              'role': 'user',
              'content': prompt
            }
          ],
          temperature: 0,
          max_tokens: 100,
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIApiKey}`
        },
        parseResponse: (data: any): string => data.choices[0].message.content,
      },
      [MODES.GROQ]: {
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        body: {
          model: 'llama3-8b-8192',
          'messages': [
            {
              'role': 'system',
              'content': SYSTEM_PROMPT,
            },
            {
              'role': 'user',
              'content': prompt
            }
          ],
          temperature: 0,
          max_tokens: 100,
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        parseResponse: (data: any): string => data.choices[0].message.content,
      },
      [MODES.OLLAMA_GENERATE]: {
        endpoint: `${ollamaUrl}/generate`,
        body: {
          model: 'codellama:code',
          prompt: prompt,
          stream: false,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        parseResponse: (data: any): string => data.message.content,
      },
      [MODES.OLLAMA_CHAT]: {
        endpoint: `${ollamaUrl}/chat`,
        body: {
          model: 'codellama:instruct',
          'messages': [
            {
              'role': 'system',
              'content': SYSTEM_PROMPT,
            },
            {
              'role': 'user',
              'content': prompt
            }
          ],
          stream: false,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        parseResponse: (data: any): string => data.message.content,
      },
    }[mode];

    if (!foundMode) {
      throw new Error(`Unknown mode: ${mode}`);
    }

    return foundMode;
  })();

  try {
    const { data } = await axios.post(
      endpoint,
      body,
      {
        headers,
      }
    );

    return parseResponse(data);
  } catch (error: any) {
    console.log('openAIRequest error', error);
    return '';
  }
};

type UseCopilotOptions = {
  code: string,
  enable: boolean,
  onChange: (newValue: string) => void,
  mode: Mode,
  openAIApiKey: string,
  groqApiKey: string,
  ollamaUrl: string,
}
export const useCopilot = ({ code, enable, onChange, mode, openAIApiKey, groqApiKey, ollamaUrl }: UseCopilotOptions) => {
  const { set: setInCache, get: getFromCache } = useCache();
  const callOpenAi = useMemo(() => {
    return pDebounce(completionRequest({
      openAIApiKey,
      groqApiKey,
      ollamaUrl,
      mode,
    }), DEBOUNCE_WAIT);
  }, [openAIApiKey, groqApiKey, ollamaUrl, mode]);

  useEffect(() => {
    if (!code || !enable) {
      return;
    }
    const cachedResponse = getFromCache(code);
    if (cachedResponse === null) {
      callOpenAi(code).then(results => {
        if (results) {
          setInCache(code, results);
        }
      });
    }
  }, [code, enable, getFromCache, setInCache, callOpenAi]);

  const handleAccept = () => {
    const completion = getFromCache(code) ?? '';
    if (completion) {
      onChange(code + completion);
    }
  };

  const completion = useMemo(
    () => (enable && getFromCache(code)) ?? '',
    [enable, getFromCache, code]
  );

  return [completion, handleAccept] as const;
};
