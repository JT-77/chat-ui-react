import { Box, Button, Icon, TextField } from '@mui/material';
import React from 'react';

import { ChatController } from '../chat-controller';
import { TextActionRequest, TextActionResponse } from '../chat-types';

export function MuiTextInput({
  chatController,
  actionRequest,
}: {
  chatController: ChatController;
  actionRequest: TextActionRequest;
}): React.ReactElement {
  const chatCtl = chatController;
  const [value, setValue] = React.useState(actionRequest.defaultValue);
  const [dis, setDis] = React.useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const val = e.target.value;
    let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

    if(val.match(pattern)) {
      setDis(false);              
    } else {
      setDis(true);              
    }
        
    setValue(val); 
  }

  const setResponse = React.useCallback((): void => {
    if (value) {
      const res: TextActionResponse = { type: 'text', value };
      chatCtl.setActionResponse(actionRequest, res);
      setValue('');
    }
  }, [actionRequest, chatCtl, value]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      if (e.nativeEvent.isComposing) {
        return;
      }

      if (actionRequest.datatype === 'email' && dis === true) {
        return;
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        setResponse();
      }
    },
    [setResponse],
  );

  const sendButtonText = actionRequest.sendButtonText
    ? actionRequest.sendButtonText
    : 'Send';

  return (
    <Box
      sx={{
        flex: '1 1 auto',
        display: 'flex',
        '& > *': {
          flex: '1 1 auto',
          minWidth: 0,
        },
        '& > * + *': {
          ml: 1,
        },
        '& :last-child': {
          flex: '0 1 auto',
        },
      }}
    >
      {
        actionRequest.datatype === 'text' ? 
        (<TextField
        placeholder={actionRequest.placeholder}
        value={value}
        onChange={(e): void => setValue(e.target.value)}
        autoFocus
        multiline
        inputProps={{ onKeyDown: handleKeyDown }}
        variant="outlined"
        maxRows={10}
      />)
      :
      actionRequest.datatype === 'number' ? 
      (<TextField
        placeholder={actionRequest.placeholder}
        value={value}
        type={actionRequest.datatype}
        onChange={(e): void => setValue(e.target.value)}
        autoFocus
        inputProps={{ onKeyDown: handleKeyDown, min: 0 }}
        variant="outlined"
      />)
      :
      (<TextField
        placeholder={actionRequest.placeholder}
        value={value}
        type={actionRequest.datatype}
        onChange={handleChange}
        autoFocus
        inputProps={{ onKeyDown: handleKeyDown }}
        variant="outlined"
      />)
      }
      {
        actionRequest.datatype === 'email' ?
        <Button
        type="button"
        onClick={setResponse}
        disabled={dis}
        variant="contained"
        color="primary"
        startIcon={<Icon>send</Icon>}
      >
        {sendButtonText}
      </Button>
      :
      <Button
        type="button"
        onClick={setResponse}
        disabled={!value}
        variant="contained"
        color="primary"
        startIcon={<Icon>send</Icon>}
      >
        {sendButtonText}
      </Button>
      }
    </Box>
  );
}
