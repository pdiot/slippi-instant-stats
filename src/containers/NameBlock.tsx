import styled from "@emotion/styled";
import { EditBlock, OptionalEditBlock } from "components/Block";
import { useParam } from "lib/hooks";
import React from "react";

const Name = styled.div`
  font-size: 150%;
  font-weight: 800;
`;

const Subtitle = styled.div<{
  show?: boolean;
}>`
  margin-top: -0.3rem;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  font-weight: 600;
`;

export interface NameBlockProps {
  nameParam: string;
  defaultName: string;
  subtitleParam: string;
  primaryColor: string;
}

export const NameBlock: React.FC<NameBlockProps> = ({ nameParam, defaultName, subtitleParam, primaryColor }) => {
  const [name, setName] = useParam(nameParam, defaultName);
  const [sub, setSub] = useParam(subtitleParam);
  return (
    <div>
      <Name>
        <EditBlock value={name} onEdit={setName} color="white" backgroundColor={primaryColor} />
      </Name>
      <Subtitle>
        <OptionalEditBlock value={sub} onEdit={setSub} color="black" backgroundColor="white" />
      </Subtitle>
    </div>
  );
};
