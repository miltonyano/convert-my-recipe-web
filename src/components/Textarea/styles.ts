import styled, { css } from 'styled-components';

import ToolTip from '../Tooltip';

interface ContainerProps {
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  border-radius: 10px;
  padding: 8px 0 8px 16px;
  width: 100%;
  border: 1px solid #232129;

  ${props =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  & + div {
    margin-top: 8px;
  }

  textarea {
    border: 0;
    background: transparent;
    width: 100%;
    resize: none;
    height: 50vh;

    &::placeholder {
      color: #666360;
      text-align: center;
      line-height: 50vh;
    }
  }
`;

export const Error = styled(ToolTip)`
  height: 20px;

  svg {
    position: absolute;
  }

  span {
    background-color: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
