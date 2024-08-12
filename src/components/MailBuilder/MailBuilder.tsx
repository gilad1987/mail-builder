import { FC, useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { NumberInput } from "@mantine/core";
import CssManager from "../../stores/CssManager.ts";
import PaddingController from "./controllers/PaddingController/PaddingController.tsx";

interface Props {
  a?: string;
}

const MailBuilder: FC<Props> = observer(() => {
  const [cssManager] = useState<CssManager>(new CssManager());

  return (
    <Container>
      <div className="start">
        {/*<NumberInput*/}
        {/*  label="Padding right"*/}
        {/*  onChange={(number) => {*/}
        {/*    cssManager.setProperty("paddingRight", `${number}px`);*/}
        {/*  }}*/}
        {/*/>*/}
        {/*<NumberInput*/}
        {/*  label="Padding left"*/}
        {/*  onChange={(number) => {*/}
        {/*    cssManager.setProperty("paddingLeft", `${number}px`);*/}
        {/*  }}*/}
        {/*/>*/}
        <PaddingController cssManager={cssManager} />
      </div>
      <div className="end">
        <div className={"test"} style={cssManager.getFull()}>
          <div className="inner">Text</div>
        </div>
      </div>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  .start {
    flex: 1;
  }
  .end {
    flex: 1;
  }
  .test {
    border: 1px solid black;
    .inner {
      background: cornflowerblue;
    }
  }
`;

export default MailBuilder;
