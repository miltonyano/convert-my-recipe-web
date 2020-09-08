import React, { TextareaHTMLAttributes, useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import { FiAlertCircle } from 'react-icons/fi';

import { Container, Error } from './styles';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  containerStyle?: Record<string, unknown>;
}

const Textarea: React.FC<TextareaProps> = ({
  name,
  containerStyle = {},
  ...rest
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: textareaRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container style={containerStyle} isErrored={!!error}>
      <textarea defaultValue={defaultValue} ref={textareaRef} {...rest} />

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};
export default Textarea;
