import React, { useState } from "react";
import styled from "styled-components";
import CssManager from "../../../../stores/CssManager.ts";

interface PaddingValues {
  Top: number;
  Right: number;
  Bottom: number;
  Left: number;
}
interface Props {
  cssManager: CssManager;
}

const PaddingController: React.FC<Props> = ({ cssManager }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handlePaddingChange = (
    side: keyof PaddingValues,
    value: number
  ): void => {
    // setPadding((prev) => ({ ...prev, [side]: value }));
    cssManager.setProperty(`padding${side}`, `${value}px`);
  };
  console.log(
    'cssManager.getProperty("padding")',
    cssManager.getProperty("padding")
  );
  console.log(cssManager.getFull());
  return (
    <Container>
      <Header onClick={() => setIsOpen(!isOpen)}>
        <Title>Padding</Title>
        <ChevronIcon isOpen={isOpen} />
      </Header>

      {isOpen && (
        <Content>
          <InputRow key={"all"}>
            <SideLabel>{"all"}</SideLabel>
            <RangeInput
              type="range"
              min="0"
              max="100"
              // value={cssManager.getProperty("padding")[side]}
              onChange={(e) => {
                cssManager.setProperty(
                  `padding`,
                  `${parseInt(e.target.value)}px`
                );
              }}
            />
            <NumberInput
              type="number"
              // value={padding[side]}
              onChange={(e) => {
                cssManager.setProperty(
                  `padding`,
                  `${parseInt(e.target.value)}px`
                );
              }}
            />
            <UnitLabel>px</UnitLabel>
          </InputRow>
          {(
            Object.values(["Top", "Right", "Bottom", "Left"]) as Array<
              keyof PaddingValues
            >
          ).map((side) => (
            <InputRow key={side}>
              <SideLabel>{side[0].toUpperCase()}</SideLabel>
              <RangeInput
                type="range"
                min="0"
                max="100"
                // value={cssManager.getProperty("padding")[side]}
                onChange={(e) =>
                  handlePaddingChange(side, parseInt(e.target.value))
                }
              />
              <NumberInput
                type="number"
                // value={padding[side]}
                onChange={(e) =>
                  handlePaddingChange(side, parseInt(e.target.value))
                }
              />
              <UnitLabel>px</UnitLabel>
            </InputRow>
          ))}
        </Content>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 256px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
`;

const Title = styled.span`
  font-weight: 500;
`;

const ChevronIcon = styled.span<{ isOpen: boolean }>`
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0)")};
  transition: transform 0.3s ease;
  &::after {
    content: "▼";
    font-size: 12px;
  }
`;

const Content = styled.div`
  padding: 16px;
  border-top: 1px solid #e5e7eb;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const SideLabel = styled.div`
  width: 16px;
  color: #6b7280;
`;

const RangeInput = styled.input`
  width: 160px;
  margin-right: 8px;
`;

const NumberInput = styled.input`
  width: 48px;
  padding: 4px;
  text-align: right;
  border: 1px solid #d1d5db;
  border-radius: 4px;
`;

const UnitLabel = styled.span`
  margin-left: 4px;
`;

export default PaddingController;
