import { useEffect, useMemo } from 'react';
import axios from 'axios';
import pDebounce from 'p-debounce';

import { DEBOUNCE_WAIT, SYSTEM_PROMPT } from './constants';
import { useCache } from './useCache';

const openAIRequest = async (prompt: string) => {
  try {
    const { data } = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        'model': 'gpt-3.5-turbo',
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
        'temperature': 0,
        'max_tokens': 100,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer [openAIToken]'
        }
      }
    );

    return data.choices[0].message.content;
  } catch (error: any) {
    console.log('openAIRequest error', error);
    return '';
  }
};

export const useCopilot = (code, disable: boolean, onChange: (newValue: string) => void) => {
  const { set: setInCache, get: getFromCache } = useCache();
  const callOpenAi = useMemo(() => {
    return pDebounce(openAIRequest, DEBOUNCE_WAIT);
  }, []);

  useEffect(() => {
    if (!code || disable) {
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
  }, [code, getFromCache, setInCache]);

  const handleAccept = () => {
    const completion = getFromCache(code) ?? '';
    if (completion) {
      onChange(code + completion);
    }
  };

  const completion = useMemo(() => getFromCache(code) ?? '', [getFromCache, code]);

  return [completion, handleAccept] as const;
};
